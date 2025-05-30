import { Card, Col, Container, Row } from 'shards-react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';

import PageTitle from '#c/components/common/PageTitle';
import LoginForm from '#c/components/components-overview/LoginForm';
import { savePost } from '#c/functions';

export default function Login() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const params = useParams();

  const fromPage = searchParams.get('fromPage');
  if (params._state === 'goToCheckout') savePost({ goToCheckout: true });
  if (params._state === 'goToChat') savePost({ goToChat: true });

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle
          sm="12"
          title={t('login / register')}
          subtitle={t('user account')}
          className="text-sm-left"
        />
      </Row>

      <div className="w-100 login-register-form-wrapper">
        <Col lg="4" className="mx-auto mb-4">
          <Card>
            <LoginForm
              goToCheckout={params._state === 'goToCheckout'}
              fromPage={fromPage}
            />
          </Card>
        </Col>
      </div>
    </Container>
  );
}
