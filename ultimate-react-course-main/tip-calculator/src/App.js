import { useState } from "react";

export default function App() {
  const [billAmount, setBillAmount] = useState(0)
  const [serviceSurvey, setServiceSurvey] = useState('Dissatisfied (0%)')
  const [friendServiceSurvey, setFriendServiceSurvey] = useState('Dissatisfied (0%)')

  return (
    <>
      <h1>Tip Calculator</h1>
      <BillAmount billAmount={billAmount} setBillAmount={setBillAmount} />
      <ServiceSurvey serviceSurvey={serviceSurvey} setServiceSurvey={setServiceSurvey} />
      <FriendServiceSurvey friendServiceSurvey={friendServiceSurvey} setFriendServiceSurvey={setFriendServiceSurvey} />
      <CalculationResult />
    </>

  );
}


function BillAmount({ billAmount, setBillAmount }) {
  console.log('BillAmount component billAmount:', billAmount);
  return (<>
    <span>How Much Was the Bill ?</span> <input type="text" placeholder="enter bill amount...." onChange={(e) => setBillAmount(e.target.value)} />
  </>)
}

const surveyQuestions = ['Dissatisfied (0%)', 'It was okay (5%)', 'It was good (10%)', 'Absolutely amazing! (20%']

function ServiceSurvey({ serviceSurvey, setServiceSurvey }) {
  console.log('ServiceSurvey component billAmount:', serviceSurvey);
  return (
    <div>
      <br />
      <span>How did you like the service?</span>
      <select onChange={(e) => setServiceSurvey(e.target.value)}> {surveyQuestions.map((el, index) => (<option value={el} key={index} > {el} </option>))} </select>
    </div>)
}

const friendSurveyQuestions = ['Dissatisfied (0%)', 'It was okay (5%)', 'It was good (10%)', 'Absolutely amazing! (20%']

function FriendServiceSurvey({ friendServiceSurvey, setFriendServiceSurvey }) {
  return (
    <div>
      <br />
      <span>How did your friend like the service?</span>
      <select> {friendSurveyQuestions.map((el, index) => (<option value={el} key={index}> {el}</option>))} </select>
    </div>)
}

function CalculationResult() { return (<><h1>{`you pay ( x )( bill amt + ( your serv survey + your friend serv survey / 2 )`}</h1></>) }