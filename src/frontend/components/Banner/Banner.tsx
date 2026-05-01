// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link';
import * as S from './Banner.styled';

const Banner = () => {
  return (
    <S.Banner>
      <S.ImageContainer>
        <S.BannerImg />
      </S.ImageContainer>
      <S.TextContainer>
        <S.Title>世界をもっと近くに — 最高の望遠鏡</S.Title>
        <Link href="#hot-products"><S.GoShoppingButton>ショッピングへ</S.GoShoppingButton></Link>
      </S.TextContainer>
    </S.Banner>
  );
};

export default Banner;
