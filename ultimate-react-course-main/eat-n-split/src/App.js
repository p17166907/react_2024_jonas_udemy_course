import { useState } from "react";

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
export function Button({ children, onClick }) { return (<button className="button" onClick={onClick}>{children}</button>) }

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends); // Using initialFriends

  const handleShowAddFriend = () => { setShowAddFriend((currentDisplay) => !currentDisplay); };

  // Function to add a new friend to the list
  const addFriend = (newFriend) => { setFriends((prevFriends) => [...prevFriends, newFriend]); };

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList friends={friends} />
        {showAddFriend && <FormAddFriend addFriend={addFriend} />}
        <Button onClick={handleShowAddFriend}>Add Friend</Button>
      </div>
      <FormSplitBill />
    </div>
  );
}

export function FriendList({ friends }) {
  return (<ul>  {friends.map((friend) => (<Friend friendObj={friend} key={friend.id} />))}  </ul>);
}


export function Friend({ friendObj }) {
  const { name, image, balance } = friendObj;

  const renderBalanceStatus = () => {
    if (balance === 0) return <p>Balance is {balance}</p>;

    const balanceText = balance < 0 ? `You owe ${name} £${Math.abs(balance)}` : `${name} owes you £${balance}`;

    const balanceClassName = balance < 0 ? "red" : "green";

    return <p className={balanceClassName}>{balanceText}</p>;
  };

  return (
    <li>
      <img src={image} alt={name} />
      <h3>{name}</h3>
      {renderBalanceStatus()}
      <Button>Select</Button>
    </li>
  );
}
export function FormAddFriend({ addFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;

    // Generate a unique ID for the new friend
    const id = crypto.randomUUID();
    //new friend object
    const newFriend = { id, name, image: `${image}?u=${id}`, balance: 0, };

    addFriend(newFriend); // Use the addFriend function from props

    setName("");
    setImage("https://i.pravatar.cc/48");
  };

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👥 Friend Name</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

      <label>🌄 Image URL</label>
      <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill() {
  return (
    <form className="form-split-bill">
      <h2>{`Split a bill with {friend name}`}</h2>

      <label>💰 Bill Value</label>
      <input type="text" />

      <label>🫵🏾 Your expense</label>
      <input type="text" />

      <label> {`👯‍♂️ {friend name} expense`}</label>
      <input type="text" disabled />

      <label>🤑 Who is paying the bill</label>
      <select>
        <option value='user'>You</option>
        <option value='friend'>{`{friend name}`}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  )
}