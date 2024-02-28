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
  const [selectedFriendObj, setSelectedFriendObj] = useState(null)

  const handleShowAddFriend = () => { setShowAddFriend((currentDisplay) => !currentDisplay); };

  // Function to add a new friend to the list
  const addFriend = (newFriendObj) => { setFriends((prevFriendObjects) => [...prevFriendObjects, newFriendObj]); setShowAddFriend(false); };

  const handleSelection = (friendObj) => {
    setSelectedFriendObj((currSelected) => currSelected && currSelected.id === friendObj.id ? null : friendObj);
    setShowAddFriend(false)
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList friends={friends} handleSelection={handleSelection} selectedFriendObj={selectedFriendObj} />
        {(showAddFriend) && <FormAddFriend addFriend={addFriend} />}
        <Button onClick={handleShowAddFriend}> {(showAddFriend) ? 'Close' : 'Add Friend'} </Button>
      </div>

      {(selectedFriendObj) && <FormSplitBill selectedFriendObj={selectedFriendObj} />}


    </div>
  );
}

export function FriendList({ friends, handleSelection, selectedFriendObj }) {
  return (<ul>  {friends.map((friend) => (<Friend friendObj={friend} key={friend.id} handleSelection={handleSelection} selectedFriendObj={selectedFriendObj} />))}  </ul>);
}


export function Friend({ friendObj, handleSelection, selectedFriendObj }) {
  const { name, image, balance } = friendObj;

  const isSelected = selectedFriendObj === friendObj

  const renderBalanceStatus = () => {
    if (balance === 0) return <p>Balance is {balance}</p>;

    const balanceText = balance < 0 ? `You owe ${name} £${Math.abs(balance)}` : `${name} owes you £${balance}`;

    const balanceClassName = balance < 0 ? "red" : "green";

    return <p className={balanceClassName}>{balanceText}</p>;
  };

  return (
    <li className={(isSelected) ? ("selected") : ("")}>
      <img src={image} alt={name} />
      <h3>{name}</h3>
      {renderBalanceStatus()}
      <Button onClick={() => handleSelection(friendObj)}>{(isSelected) ? ("Close") : ("Select")}</Button>
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

function FormSplitBill({ selectedFriendObj }) {
  // Utility function to capitalize the first letter of the friend's name
  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  return (
    <form className="form-split-bill">
      <h2>{`Split a bill with ${(selectedFriendObj) ? (selectedFriendObj.name) : 'selected friend'}`}</h2>

      <label>💰 Bill Value</label>
      <input type="text" />

      <label>🫵🏾 Your expense</label>
      <input type="text" />

      <label> {`👯‍♂️ ${selectedFriendObj ? `${capitalizeFirstLetter(selectedFriendObj.name)}'s` : ''} expense`}</label>
      <input type="text" disabled />

      <label>🤑 Who is paying the bill</label>
      <select>
        <option value='user'>You</option>
        <option value='friend'>{`${selectedFriendObj ? capitalizeFirstLetter(selectedFriendObj.name) : 'selected friend'}`}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  )
}