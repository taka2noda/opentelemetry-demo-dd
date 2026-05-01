// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import Image from 'next/image';
import { useState } from 'react';
import { CypressFields } from '../../utils/enums/CypressFields';
import { Address } from '../../protos/demo';
import { IProductCheckoutItem } from '../../types/Cart';
import ProductPrice from '../ProductPrice';
import * as S from './CheckoutItem.styled';

interface IProps {
  checkoutItem: IProductCheckoutItem;
  address: Address;
}

const CheckoutItem = ({
  checkoutItem: {
    item: {
      quantity,
      product: { picture, name },
    },
    cost = { currencyCode: 'USD', units: 0, nanos: 0 },
  },
  address: { streetAddress = '', city = '', state = '', zipCode = '', country = '' },
}: IProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <S.CheckoutItem data-cy={CypressFields.CheckoutItem}>
      <S.ItemDetails>
        {picture && <S.ItemImage src={`/images/products/${picture}`} alt={name} />}
        <S.Details>
          <S.ItemName>{name}</S.ItemName>
          <p>数量: {quantity}</p>
          <p>
            合計: <ProductPrice price={cost} />
          </p>
        </S.Details>
      </S.ItemDetails>
      <S.ShippingData>
        <S.ItemName>配送情報</S.ItemName>
        <p>番地: {streetAddress}</p>
        {!isCollapsed && <S.SeeMore onClick={() => setIsCollapsed(true)}>詳細を見る</S.SeeMore>}
        {isCollapsed && (
          <>
            <p>市区町村: {city}</p>
            <p>都道府県: {state}</p>
            <p>郵便番号: {zipCode}</p>
            <p>国: {country}</p>
          </>
        )}
      </S.ShippingData>
      <S.Status>
        <Image src="/icons/Check.svg" alt="check" height="14" width="16" /> <span>完了</span>
      </S.Status>
    </S.CheckoutItem>
  );
};

export default CheckoutItem;
