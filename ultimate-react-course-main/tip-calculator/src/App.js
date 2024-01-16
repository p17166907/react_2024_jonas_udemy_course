
export default function App() {
  return (
    <>
      <h1>Tip Calculator</h1>
      <BillAmount />
    </>

  );
}


function BillAmount() { return <> <span>How Much Was the Bill ?</span> <input type="text" placeholder="enter bill amount...."></input></> }

