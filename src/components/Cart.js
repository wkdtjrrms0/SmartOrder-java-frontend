import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

function Cart(props) {
  let state = useSelector((state) => state);
  let dispatch = useDispatch();
  return (
    <>
      <Table responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>상품명</th>
            <th>가격</th>
            <th>수량</th>
            <th>변경</th>
          </tr>
        </thead>
        <tbody>
          {
            state.reducer1.map((obj, i) => {
              return (
                <tr key={i}>
                  <td>{obj.id}</td>
                  <td>{obj.name}</td>
                  <td>{obj.price}</td>
                  <td>{obj.qty}</td>
                  <td>
                    <a class="btn btn-secondary" role="button" onClick={() => {
                      dispatch({
                        type: 'plusQTY',
                        data: obj.id
                      });
                    }}>+</a>
                    &nbsp;
                    <a class="btn btn-secondary" role="button" onClick={() => {
                      dispatch({
                        type: 'minusQTY',
                        data: obj.id
                      });
                    }}>-</a>
                  </td>
                </tr>
              )
            })
          }
          { <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
          </tr> }
        </tbody>
      </Table>
    </>
  )
}

export default Cart;