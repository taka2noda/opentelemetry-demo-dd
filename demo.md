# AIOps デモ手順書

Datadog Live Tokyo (2026-05-20) 向けデモ実行手順。

---

## 前提条件チェック

```bash
docker compose ps   # 全コンテナが Running であること
```

- 全モニターが OK または WARNING 以下であること（Datadog UI で確認）
- 全フラグが OFF であること（http://localhost:8080/feature/ で確認）

---

## 前置き：高トラフィック演出

http://localhost:8080/feature/ で以下を ON にする：

```
loadGeneratorFloodHomepage: ON
```

「通常より高いトラフィックが来ている状態」として演出。

---

## シナリオ A：決済サービス障害（5〜7分）

### 障害注入

payment コンテナを停止することで、フラグを使わずに checkout → payment の依存エラーを発生させる。

```bash
docker compose stop payment
```

### 期待する流れ

1. checkout サービスが payment への gRPC 接続に失敗（`UNAVAILABLE` / `connection refused`）
2. `APM Error Rate by Service` → `checkout` で ALERT（約1〜2分）
3. `Checkout Service Error Count` → ALERT
4. `Log Error Count by Service` → ALERT
5. Event Correlation により `checkout` サービスの Case が作成される
6. Case が SEV-2 に達すると Incident が自動作成
7. On-Call に通知が届く

### Bits AI への質問例

- "Why is the checkout service failing?"
- "What is the root cause of the checkout errors?"

期待する RCA：checkout のトレースから payment サービスへの RPC が失敗していることを特定。

### 復旧

```bash
docker compose start payment
```

モニターが OK に戻ることを確認。

---

## シナリオ B：LLM チャット障害（5〜7分）

### 障害注入

`docker-compose.override.yml` の `product-reviews` に無効な API キーを追加して再起動することで、フラグを使わずに OpenAI API 認証エラーを発生させる。

**`docker-compose.override.yml` に追記：**

```yaml
product-reviews:
  environment:
    - OPENAI_API_KEY=invalid_key_for_demo
```

```bash
docker compose restart product-reviews
```

### 期待する流れ

1. product-reviews が OpenAI API から 401 エラーを受け取る
2. `APM Error Rate by Service` → `product-reviews` で ALERT
3. `Log Error Count by Service` → ALERT
4. LLM Observability にエラーが表示される
5. Event Correlation により Case が作成される

### Bits AI への質問例

- "Why is the product reviews service failing?"
- "What is causing errors in the LLM chat?"

期待する RCA：product-reviews のトレースおよび LLM Obs から OpenAI API への認証エラー（401）を特定。

### 復旧

`docker-compose.override.yml` から追記した行を削除して再起動：

```bash
docker compose restart product-reviews
```

モニターが OK に戻ることを確認。

---

## シナリオ C：メモリリーク（任意・時間があれば）

http://localhost:8080/feature/ で以下を設定：

```
emailMemoryLeak: 100x または 1000x
```

### 期待する流れ

1. `Container Memory Usage Spike` → `email` で徐々に ALERT
2. 「気づきにくい障害」としての予兆検知デモ

### 復旧

```
emailMemoryLeak: OFF
```

---

## 全シナリオのリセット

```bash
# シナリオ A の後
docker compose start payment

# シナリオ B の後（docker-compose.override.yml から OPENAI_API_KEY 行を削除してから）
docker compose restart product-reviews

# フラグを全て OFF に戻す
# http://localhost:8080/feature/ から手動で設定
```
