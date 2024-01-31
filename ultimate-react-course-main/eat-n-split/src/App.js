const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList />
      </div>
    </div>
  )
}

export function FriendList() {
  const friends = initialFriends
  return (
    <ul>{friends.map((friendObj) => <Friend friendObj={friendObj} key={friendObj.id} />)}</ul>
  )
}

/**
 * Component to display friend details.
 * @param {Object} props - Component props.
 * @param {Object} props.friendObj - Object containing friend's details.
 * @param {number} props.key - Unique key for list rendering.
 * @returns {JSX.Element} The Friend component.
 */
export function Friend({ friendObj }) {
  const { name, image, balance } = friendObj;

  // Renders the balance status.
  const renderBalanceStatus = () => {
    if (balance === 0) return <p>Balance is {balance}</p>;

    const balanceText = balance < 0 ? `You owe ${name} £${Math.abs(balance)}` : `${name} owes you £${balance}`;

    const balanceClassName = balance < 0 ? "red" : "green";

    return <p className={balanceClassName}> {balanceText} </p>;
  };

  return (
    <li>
      <img src={image} alt={name} />
      <h3>{name}</h3>
      {renderBalanceStatus()}
      <button className="button">Select</button>
    </li>
  );
}
