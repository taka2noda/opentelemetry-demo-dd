// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link';
import { useCallback, useState } from 'react';
import { CypressFields } from '../../utils/enums/CypressFields';
import Input from '../Input';
import * as S from './CheckoutForm.styled';

const currentYear = new Date().getFullYear();
const yearList = Array.from(new Array(20), (v, i) => i + currentYear);

export interface IFormData {
  email: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  creditCardNumber: string;
  creditCardCvv: number;
  creditCardExpirationYear: number;
  creditCardExpirationMonth: number;
}

interface IProps {
  onSubmit(formData: IFormData): void;
}

const CheckoutForm = ({ onSubmit }: IProps) => {
  const [
    {
      email,
      streetAddress,
      city,
      state,
      country,
      zipCode,
      creditCardCvv,
      creditCardExpirationMonth,
      creditCardExpirationYear,
      creditCardNumber,
    },
    setFormData,
  ] = useState<IFormData>({
    email: 'someone@example.com',
    streetAddress: '1600 Amphitheatre Parkway',
    city: 'Mountain View',
    state: 'CA',
    country: 'United States',
    zipCode: "94043",
    creditCardNumber: '4432-8015-6152-0454',
    creditCardCvv: 672,
    creditCardExpirationYear: 2030,
    creditCardExpirationMonth: 1,
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(formData => ({
      ...formData,
      [e.target.name]: e.target.value,
    }));
  }, []);

  return (
    <S.CheckoutForm
      onSubmit={(event: { preventDefault: () => void; }) => {
        event.preventDefault();
        onSubmit({
          email,
          streetAddress,
          city,
          state,
          country,
          zipCode,
          creditCardCvv,
          creditCardExpirationMonth,
          creditCardExpirationYear,
          creditCardNumber,
        });
      }}
    >
      <S.Title>配送先住所</S.Title>

      <Input
        label="メールアドレス"
        type="email"
        id="email"
        name="email"
        value={email}
        required
        onChange={handleChange}
      />
      <Input
        label="番地・建物名"
        type="text"
        name="streetAddress"
        id="street_address"
        value={streetAddress}
        onChange={handleChange}
        required
      />
      <Input
        label="郵便番号"
        type="text"
        name="zipCode"
        id="zip_code"
        value={zipCode}
        onChange={handleChange}
        required
      />
      <Input label="市区町村" type="text" name="city" id="city" value={city} required onChange={handleChange} />

      <S.StateRow>
        <Input label="都道府県" type="text" name="state" id="state" value={state} required onChange={handleChange} />
        <Input
          label="国"
          type="text"
          id="country"
          placeholder="国名"
          name="country"
          value={country}
          onChange={handleChange}
          required
        />
      </S.StateRow>

      <div>
        <S.Title>支払い方法</S.Title>
      </div>

      <Input
        type="text"
        label="クレジットカード番号"
        id="credit_card_number"
        name="creditCardNumber"
        placeholder="0000-0000-0000-0000"
        value={creditCardNumber}
        onChange={handleChange}
        required
        pattern="\d{4}-\d{4}-\d{4}-\d{4}"
      />

      <S.CardRow>
        <Input
          label="月"
          name="creditCardExpirationMonth"
          id="credit_card_expiration_month"
          value={creditCardExpirationMonth}
          onChange={handleChange}
          type="select"
        >
          <option value="1">1月</option>
          <option value="2">2月</option>
          <option value="3">3月</option>
          <option value="4">4月</option>
          <option value="5">5月</option>
          <option value="6">6月</option>
          <option value="7">7月</option>
          <option value="8">8月</option>
          <option value="9">9月</option>
          <option value="10">10月</option>
          <option value="11">11月</option>
          <option value="12">12月</option>
        </Input>
        <Input
          label="年"
          name="creditCardExpirationYear"
          id="credit_card_expiration_year"
          value={creditCardExpirationYear}
          onChange={handleChange}
          type="select"
        >
          {yearList.map(year => (
            <option value={year} key={year}>
              {year}
            </option>
          ))}
        </Input>
        <Input
          label="CVV"
          type="password"
          id="credit_card_cvv"
          name="creditCardCvv"
          value={creditCardCvv}
          required
          pattern="\d{3}"
          onChange={handleChange}
        />
      </S.CardRow>

      <S.SubmitContainer>
        <Link href="/">
          <S.CartButton $type="secondary">ショッピングを続ける</S.CartButton>
        </Link>
        <S.CartButton data-cy={CypressFields.CheckoutPlaceOrder} type="submit">注文を確定する</S.CartButton>
      </S.SubmitContainer>
    </S.CheckoutForm>
  );
};

export default CheckoutForm;
