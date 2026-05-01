// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import * as S from './Footer.styled';
import SessionGateway from '../../gateways/Session.gateway';
import { CypressFields } from '../../utils/enums/CypressFields';
import PlatformFlag from '../PlatformFlag';

const currentYear = new Date().getFullYear();

const { userId } = SessionGateway.getSession();

const Footer = () => {
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    setSessionId(userId);
  }, []);

  return (
    <S.Footer>
      <div>
        <p>このウェブサイトはデモ目的でのみ公開されています。実際のショップではありません。</p>
        <p>
          <span data-cy={CypressFields.SessionId}>セッションID: {sessionId}</span>
        </p>
      </div>
      <p>
        @ {currentYear} OpenTelemetry (<a href="https://github.com/open-telemetry/opentelemetry-demo">Source Code</a>)
      </p>
      <PlatformFlag />
    </S.Footer>
  );
};

export default Footer;
