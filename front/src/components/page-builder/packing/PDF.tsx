import { forwardRef } from 'react';

import { fPrice } from '@/helpers';

import {
  Container,
  Title,
  Label,
  Table,
  Header,
  Signature,
  BreakWord,
} from '../invoice/components';

const Sum = (arr = [], key) => arr.reduce((c, n) => c + Number(n[key]), 0);

const FormatFixed = (n) => fPrice(Number(Number(n).toFixed()));

export default forwardRef<HTMLDivElement, any>(function PDF({ DATA }, ref) {
  return (
    <Container ref={ref}>
      <Title variant="h2">PACKING LIST</Title>
      <Header>
        <div>
          <span>DATE:</span>
          <span>PACKING LIST NO:</span>
        </div>
        <div>
          <span>{DATA.date}</span>
          <span>{DATA.packing_no || ''}</span>
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
            <th>NET</th>
            <th>GROSS</th>
          </tr>
        </thead>
        <tbody>
          {DATA.items?.map((item, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{item.description}</td>
              <td>{fPrice(item.qty)}</td>
              <td>{fPrice(item.net)}</td>
              <td>{fPrice(item.gross)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2} style={{ textAlign: 'center' }}>
              <Label>TOTAL</Label>
            </td>
            <td>
              <Label>{FormatFixed(Sum(DATA.items, 'qty'))}</Label>
            </td>
            <td>
              <Label>
                {FormatFixed(Sum(DATA.items, 'qty') * Sum(DATA.items, 'net'))}
              </Label>
            </td>
            <td>
              <Label>
                {FormatFixed(Sum(DATA.items, 'qty') * Sum(DATA.items, 'gross'))}
              </Label>
            </td>
          </tr>
        </tfoot>
      </Table>

      <Signature>Signature</Signature>
    </Container>
  );
});
