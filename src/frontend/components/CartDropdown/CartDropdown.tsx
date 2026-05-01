// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { CypressFields } from '../../utils/enums/CypressFields';
import { IProductCartItem } from '../../types/Cart';
import ProductPrice from '../ProductPrice';
import * as S from './CartDropdown.styled';

interface IProps {
  isOpen: boolean;
  onClose(): void;
  productList: IProductCartItem[];
}

const CartDropdown = ({ productList, isOpen, onClose }: IProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, onClose]);

  return isOpen ? (
    <S.CartDropdown ref={ref} data-cy={CypressFields.CartDropdown}>
      <S.ContentWrapper>
        <S.Header>
          <S.Title>ショッピングカート</S.Title>
          <span onClick={onClose}>閉じる</span>
        </S.Header>
        <S.ItemList>
          {!productList.length && <S.EmptyCart>カートに商品がありません</S.EmptyCart>}
          {productList.map(
            ({ quantity, product: { name, picture, id, priceUsd = { nanos: 0, currencyCode: 'USD', units: 0 } } }) => (
              <S.Item key={id} data-cy={CypressFields.CartDropdownItem}>
                {picture && <S.ItemImage src={'/images/products/' + picture} alt={name} />}
                <S.ItemDetails $fullWidth={!picture}>
                  <S.ItemName>{name}</S.ItemName>
                  <ProductPrice price={priceUsd} />
                  <S.ItemQuantity>数量: {quantity}</S.ItemQuantity>
                </S.ItemDetails>
              </S.Item>
            )
          )}
        </S.ItemList>
      </S.ContentWrapper>
      <Link href="/cart">
        <S.CartButton data-cy={CypressFields.CartGoToShopping}>カートへ進む</S.CartButton>
      </Link>
    </S.CartDropdown>
  ) : null;
};

export default CartDropdown;
