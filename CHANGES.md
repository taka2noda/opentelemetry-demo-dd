# Datadog AIOps Demo 変更内容まとめ

Datadog Live Tokyo (2026-05-20) デモ向けの設定変更記録。

---

## 1. アプリケーションに対して実施した設定

### `docker-compose.override.yml`

- **OTel Collector 設定ファイルの追加読み込み**
  - `otelcol-config-extras.yml` をマウント
  - Feature Gate `datadog.EnableOperationAndResourceNameV2` を有効化
  - 環境変数 `DD_SITE_PARAMETER`, `DD_API_KEY` を注入

- **product-reviews の Semantic Convention 設定**
  - `OTEL_SEMCONV_STABILITY_OPT_IN=gen_ai_latest_experimental` を追加

- **全アプリサービスへの Docker ラベル付与**
  - `com.datadoghq.service: <service名>` を付与
  - docker_stats レシーバーがこのラベルを `service` メトリクスタグとして取り込む
  - Container Memory/CPU モニターが APM・Log モニターと同じ `service` タグで Case にグルーピングされるようにするため

対象サービス: `ad`, `cart`, `checkout`, `currency`, `email`, `fraud-detection`, `frontend`, `frontend-proxy`, `image-provider`, `load-generator`, `payment`, `product-catalog`, `quote`, `recommendation`, `shipping`

### `src/otel-collector/otelcol-config-extras.yml`

- **Datadog Extension/Exporter/Connector の追加**
  - `datadog/extension`: メタデータエンドポイント
  - `datadog` exporter: APM Stats（`compute_stats_by_span_kind: true`）、送信キュー設定
  - `otlphttp/llmobs` exporter: LLM Observability 向けパイプライン
  - `datadog/connector`: トレース→メトリクス変換

- **`resource` processor**
  - `deployment.environment.name: "otel"` を全テレメトリに付与

- **`filter/genai` processor**
  - `gen_ai.operation.name` 属性がないスパンを LLM Obs パイプラインから除外

- **`docker_stats` receiver の拡張**
  - `container_labels_to_metric_labels: com.datadoghq.service: service`
  - Docker ラベルをメトリクスの `service` タグにマッピング

- **パイプライン設定**
  - `traces`: Datadog exporter を追加
  - `metrics`: Datadog exporter、docker_stats を含む全レシーバーを追加
  - `logs`: Datadog exporter を追加
  - `traces/llmobs`: LLM Obs 専用パイプラインを追加

### フロントエンド UI の日本語化（`src/frontend/`）

以下のコンポーネント・ページのテキスト表記を日本語に変更：

| ファイル | 変更箇所 |
|---|---|
| `components/Banner/Banner.tsx` | バナーテキスト |
| `components/Cart/CartDetail.tsx` | カート詳細ラベル |
| `components/Cart/EmptyCart.tsx` | 空カートメッセージ |
| `components/CartDropdown/CartDropdown.tsx` | カートドロップダウン |
| `components/CartItems/CartItems.tsx` | カートアイテム表示 |
| `components/CheckoutForm/CheckoutForm.tsx` | チェックアウトフォーム |
| `components/CheckoutItem/CheckoutItem.tsx` | チェックアウトアイテム |
| `components/Footer/Footer.tsx` | フッターテキスト |
| `components/ProductReviews/ProductReviews.tsx` | 商品レビュー表示 |
| `components/Recommendations/Recommendations.tsx` | レコメンド表示 |
| `pages/cart/checkout/[orderId]/index.tsx` | 注文完了ページ |
| `pages/cart/index.tsx` | カートページ |
| `pages/index.tsx` | トップページ |
| `pages/product/[productId]/index.tsx` | 商品詳細ページ |

### PostgreSQL レビューデータの日本語化（`src/postgresql/init.sql`）

- `reviews.productreviews` テーブルの初期データ（ユーザー名・レビュー文）を日本語に変更
- 全商品（10種）のレビュー（各5件）が対象

### `src/product-reviews/requirements.txt`

- `wrapt<2.0` を追加（依存関係の互換性対応）

### `.env.override`（LLM サービス設定）

- `LLM_BASE_URL`: OpenAI API エンドポイントを設定
- `LLM_MODEL`: `gpt-4o-mini` を指定
- `OPENAI_API_KEY`: API キーを設定
- llm コンテナが実際の OpenAI モデルを使用するための設定
- **注意**: このファイルに API キーが含まれるため Git にコミットしないこと

---

## 2. Datadog に対して実施した設定

### 2-1. Terraform で管理（`terraform/` ディレクトリ）

#### Team (`team.tf`)
- チーム名: `AIOps Demo` / handle: `aiops-demo`
- メンバー: takaaki.tsunoda@datadoghq.com（admin）

#### On-Call (`oncall.tf`)
- スケジュール: `AIOps Demo On-Call`（タイムゾーン: Asia/Tokyo）
- エスカレーションポリシー: `AIOps Demo Escalation Policy`（300秒後にエスカレーション）
- チームルーティングルール: urgency=high → 上記エスカレーションポリシー

#### モニター × 6 (`monitors.tf`)
共通設定: `env:otel`, `managed_by:terraform`, `evaluation_delay=15`, 評価ウィンドウ `last_1m`

| モニター名 | 種別 | 閾値 | 主な発火シナリオ |
|---|---|---|---|
| APM Error Rate by Service | query alert | >5%（gRPC+HTTP, `by {service}`） | paymentFailure, productCatalogFailure |
| Log Error Count by Service | log alert | >5件/分（`by {service}`） | 各シナリオ |
| Container Memory Usage Spike | query alert | >80MB（`by {service}`） | emailMemoryLeak |
| Container CPU Utilization Spike | query alert | >80%（`by {service}`） | adHighCpu |
| APM P99 Latency Spike by Service | query alert | >1s / warning >500ms | productCatalogFailure（10秒遅延） |
| Checkout Service Error Count | query alert | >3件/分（checkout固定） | paymentFailure の伝播検知 |

#### Incident Type (`incident.tf`)
- 名前: `AIOps Demo`

### 2-2. Datadog UI / 手動で設定

#### Case Management
- プロジェクト作成: `AIOps Demo`（キー: `DDAIOPS`）
- **Event Correlation パターン**
  - Source: Datadog Monitors
  - フィルター: `env:otel`
  - グルーピングタグ: `service`
  - Intelligent Correlation: ON
  - 最小アラート数: 2（単独アラートではケース未作成）
- **Case Automation Rules**: Case が SEV-2 以上になったら Incident を自動作成

#### On-Call
- Incident 作成時の On-Call 通知設定（Incident 設定画面で構成）
- On-Call ユーザープロフィール（各ユーザーがモバイルアプリ/SMS を設定）

---

## 3. デモシナリオ（当日）

詳細手順は **[demo.md](./demo.md)** を参照。

### シナリオ概要

| シナリオ | 障害注入方法 | 主な発火モニター |
|---|---|---|
| A：決済サービス障害 | `docker compose stop payment` | APM Error Rate, Checkout Error Count, Log Error Count |
| B：LLM チャット障害 | `OPENAI_API_KEY=invalid_key_for_demo` を設定して product-reviews を再起動 | APM Error Rate, Log Error Count |
| C：メモリリーク（任意） | `emailMemoryLeak: 100x` フラグ ON | Container Memory Usage Spike |

### 設計方針

シナリオ A・B はフィーチャーフラグを使用しない障害注入方式を採用。
Bits AI が観測シグナル（APM トレース・ログ・メトリクス）のみからRCAを行う流れを演出するため。

---

## 4. その他・既知の制約

### llm コンテナのクラッシュループ
- メモリ制限 50MB（`docker-compose.yml` の `deploy.resources.limits.memory`）で OOM Kill（exit code 137）が繰り返し発生
- `.env.override` で OpenAI API を設定したが、llm コンテナのメモリ不足は別問題
- 設定変更は実施せず（ユーザー判断）
- paymentFailure / productCatalogFailure シナリオへの影響なし
- `product-reviews` サービスのエラーログがノイズになる場合あり

### 外形監視（Synthetics）
- localhost 環境のため Datadog クラウドからの直接アクセス不可
- Private Location を Docker ネットワーク内に追加すれば設定可能（未実施）

### Terraform 管理外の設定
以下は UI で手動設定済みのため Terraform/MCP での変更不可：
- Event Correlation パターン
- Case Automation Rules（Case SEV-2 → Incident 自動作成）
- On-Call ユーザープロフィール（各ユーザーが設定）
- Incident 作成時の On-Call 通知設定

### 機密情報の管理
- `.env.override`（`OPENAI_API_KEY` 含む）は Git にコミットしないこと
- `.gitignore` に `.env.override` を追加済み
