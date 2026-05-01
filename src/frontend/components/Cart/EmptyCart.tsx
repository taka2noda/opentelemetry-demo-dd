// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link';
import Button from '../Button';
import * as S from '../../styles/Cart.styled';

const EmptyCart = () => {
  return (
    <S.EmptyCartContainer>
      <S.Title>カートに商品がありません</S.Title>
      <S.Subtitle>カートに追加した商品はここに表示されます。</S.Subtitle>

      <S.ButtonContainer>
        <Link href="/">
          <Button type="submit">ショッピングを続ける</Button>
        </Link>
      </S.ButtonContainer>
    </S.EmptyCartContainer>
  );
};

export default EmptyCart;
