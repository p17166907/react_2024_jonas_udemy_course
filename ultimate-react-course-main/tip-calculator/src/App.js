import { useState } from "react";

/**
 * Main application component for the tip calculator.
 * @returns {JSX.Element} The App component.
 */
export default function App() {
  const [billAmount, setBillAmount] = useState(0);
  const [serviceSurvey, setServiceSurvey] = useState('Dissatisfied (0%)');
  const [friendServiceSurvey, setFriendServiceSurvey] = useState('Dissatisfied (0%)');

  // Converts survey response to a numerical percentage.
  const servicePercentage = surveyQuestion => {
    const percentages = {
      'Dissatisfied (0%)': 0,
      'It was okay (5%)': 5,
      'It was good (10%)': 10,
      'Absolutely amazing! (20%)': 20
    };
    return percentages[surveyQuestion] || 0;
  };

  return (
    <>
      <h1>Tip Calculator</h1>
      <BillAmount billAmount={billAmount} setBillAmount={setBillAmount} />
      <ServiceSurvey serviceSurvey={serviceSurvey} setServiceSurvey={setServiceSurvey} />
      <FriendServiceSurvey friendServiceSurvey={friendServiceSurvey} setFriendServiceSurvey={setFriendServiceSurvey} />
      <CalculationResult servicePercentage={servicePercentage} serviceSurvey={serviceSurvey} friendServiceSurvey={friendServiceSurvey} billAmount={billAmount} />
    </>
  );
}

/**
 * Component to input the bill amount.
 * @param {Object} props - Component props.
 * @param {number} props.billAmount - Current bill amount.
 * @param {Function} props.setBillAmount - Setter for bill amount.
 * @returns {JSX.Element} The BillAmount component.
 */
function BillAmount({ billAmount, setBillAmount }) {
  return (
    <>
      <span>How Much Was the Bill?</span>
      <input type="text" placeholder="Enter bill amount..." value={billAmount} onChange={e => setBillAmount(Number(e.target.value) || 0)} />
    </>
  );
}

const surveyQuestions = ['Dissatisfied (0%)', 'It was okay (5%)', 'It was good (10%)', 'Absolutely amazing! (20%)'];

/**
 * Component for service survey.
 * @param {Object} props - Component props.
 * @param {string} props.serviceSurvey - Current service survey response.
 * @param {Function} props.setServiceSurvey - Setter for service survey response.
 * @returns {JSX.Element} The ServiceSurvey component.
 */
function ServiceSurvey({ serviceSurvey, setServiceSurvey }) {
  return (
    <div>
      <br />
      <span>How did you like the service?</span>
      <select value={serviceSurvey} onChange={e => setServiceSurvey(e.target.value)}>
        {surveyQuestions.map((question, index) => (<option value={question} key={index}>{question}</option>))} </select>
    </div>
  );
}

/**
 * Component for friend's service survey.
 * @param {Object} props - Component props.
 * @param {string} props.friendServiceSurvey - Current friend's service survey response.
 * @param {Function} props.setFriendServiceSurvey - Setter for friend's service survey response.
 * @returns {JSX.Element} The FriendServiceSurvey component.
 */
function FriendServiceSurvey({ friendServiceSurvey, setFriendServiceSurvey }) {
  return (
    <div>
      <br />
      <span>How did your friend like the service?</span>
      <select value={friendServiceSurvey} onChange={e => setFriendServiceSurvey(e.target.value)}>
        {surveyQuestions.map((question, index) => (<option value={question} key={index}>{question}</option>))} </select>
    </div>
  );
}

/**
 * Component to calculate and display the total amount including tip.
 * @param {Object} props - Component props.
 * @param {Function} props.servicePercentage - Function to calculate service percentage.
 * @param {string} props.serviceSurvey - Service survey response.
 * @param {string} props.friendServiceSurvey - Friend's service survey response.
 * @param {number} props.billAmount - Bill amount.
 * @returns {JSX.Element} The CalculationResult component.
 */
function CalculationResult({ servicePercentage, serviceSurvey, friendServiceSurvey, billAmount }) {
  // Calculates total service tip percentage.
  const totalServiceTipPercentage = () => (servicePercentage(serviceSurvey) + servicePercentage(friendServiceSurvey)) / 2;

  // Calculates total amount to be paid.
  const totalAmount = () => billAmount + (billAmount * totalServiceTipPercentage() / 100);

  return (
    <>
      <h1>Total to Pay: £{totalAmount().toFixed(2)}</h1>
    </>
  );
}
