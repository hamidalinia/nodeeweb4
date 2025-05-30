import { forwardRef } from 'react';

import { fPrice } from '@/helpers';

import {
  Container,
  Title,
  Label,
  EmptyCell,
  Table,
  Header,
  Signature,
  BreakWord,
} from './components';

export default forwardRef<HTMLDivElement, any>(function PDF({ DATA }, ref) {
  return (
    <Container ref={ref}>
      <Title variant="h2">INVOICE</Title>
      <Header>
        <div>
          <span>DATE:</span>
          <span>INVOICE NO:</span>
        </div>
        <div>
          <span>{DATA.date}</span>
          <span>{DATA.invoice_no || ''}</span>
        </div>
      </Header>
      <Table style={{ maxWidth: '50%' }}>
        <thead>
          <tr>
            <th>SELLER:</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <BreakWord>{DATA.seller || ''}</BreakWord>
          </tr>
        </tbody>
      </Table>

      <Table style={{ maxWidth: '50%' }}>
        <thead>
          <tr>
            <th>CONSIGNEE:</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <BreakWord>{DATA.consignee || ''}</BreakWord>
          </tr>
        </tbody>
      </Table>

      <Table style={{ textAlign: 'center' }}>
        <thead>
          <tr>
            <th>HS CODE</th>
            <th>COUNTRY OF ORIGIN</th>
            <th>TRANSPORT BY</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{DATA.hs_code}</td>
            <td>{DATA.origin}</td>
            <td>{DATA.transport_by}</td>
          </tr>
        </tbody>
      </Table>

      <Table>
        <thead>
          <tr>
            <th>ITEM</th>
            <th>DESCRIPTION AND QUALITIES OF GOODS</th>
            <th>QTY</th>
            <th>UNIT PRICE</th>
            <th>AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {DATA.items?.map((item, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{item.description}</td>
              <td>{fPrice(item.qty)}</td>
              <td>{fPrice(item.unitPrice)}</td>
              <td>{`${DATA.currency || ''} ${fPrice(item.total)}`}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <EmptyCell colSpan={2} />
            <td colSpan={2}>
              <Label>FREIGHT OF CHARGE</Label>
            </td>
            <td>{`${DATA.currency || ''} ${fPrice(DATA.foc)}`}</td>
          </tr>
          <tr>
            <EmptyCell colSpan={2} />
            <td colSpan={2}>
              <Label>TOTAL AMOUNT</Label>
            </td>
            <td>{`${DATA.currency || ''} ${fPrice(DATA.TOT)}`}</td>
          </tr>
        </tfoot>
      </Table>

      <Signature>Signature</Signature>
    </Container>
  );
});
