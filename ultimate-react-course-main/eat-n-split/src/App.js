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

/**
 * Generic button component.  @param {{ children: React.ReactNode, onClick: () => void }} props - The button props.
 */
export function Button({ children, onClick }) { return (<button className="button" onClick={onClick}>{children}</button>) }

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends); // Using initialFriends
  const [selectedFriendObj, setSelectedFriendObj] = useState(null)

  /**    * Toggles the add friend form display.    */
  const handleShowAddFriend = () => { setShowAddFriend((currentDisplay) => !currentDisplay); };

  /**
   * Adds a new friend to the list. @param {Object} newFriendObj - The new friend object to add.
   */
  const addFriend = (newFriendObj) => { setFriends((prevFriendObjects) => [...prevFriendObjects, newFriendObj]); setShowAddFriend(false); };


  /**
  * Selects or deselects a friend for bill splitting. @param {Object} friendObj - The friend object to select or deselect.
  */
  const handleSelection = (friendObj) => {
    setSelectedFriendObj((currSelected) => currSelected && currSelected.id === friendObj.id ? null : friendObj);
    setShowAddFriend(false)
  }
  console.log(friends);

  /**
  * Handles splitting the bill between the user and selected friend. @param {number} value - The value to adjust the friend's balance by.
  */
  const handleSplitBill = (value) => {
    console.log(value);

    setFriends((friendsObj) => friendsObj.map(friendObj => friendObj.id === selectedFriendObj.id ? { ...friendObj, balance: friendObj.balance + value } : friendObj))
    setSelectedFriendObj(null)
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList friends={friends} handleSelection={handleSelection} selectedFriendObj={selectedFriendObj} />
        {(showAddFriend) && <FormAddFriend addFriend={addFriend} />}
        <Button onClick={handleShowAddFriend}> {(showAddFriend) ? 'Close' : 'Add Friend'} </Button>
      </div>

      {/* The key prop helps React identify which items have changed, are added, or are removed */}
      {(selectedFriendObj) && <FormSplitBill selectedFriendObj={selectedFriendObj} handleSplitBill={handleSplitBill} key={selectedFriendObj.id} />}


    </div>
  );
}

/**
 * Displays a list of friends. @param {{ friends: Array, handleSelection: Function, selectedFriendObj: Object }} props - Component props.
 */
export function FriendList({ friends, handleSelection, selectedFriendObj }) {
  return (<ul>  {friends.map((friend) => (<Friend friendObj={friend} key={friend.id} handleSelection={handleSelection} selectedFriendObj={selectedFriendObj} />))}  </ul>);
}

/**
 * Represents a single friend item. @param {{ friendObj: Object, handleSelection: Function, selectedFriendObj: Object }} props - Component props.
 */
export function Friend({ friendObj, handleSelection, selectedFriendObj }) {
  const { name, image, balance } = friendObj;

  const isSelected = selectedFriendObj === friendObj

  /**   * Renders the friend's balance status.   */
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

/**
 * Form for adding a new friend. @param {{ addFriend: Function }} props - Component props.
 */
export function FormAddFriend({ addFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  /**
    * Handles form submission to add a new friend.
    * @param {Event} e - The form submission event.
    */
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


/**
 * Form for splitting a bill. @param {{ selectedFriendObj: Object, handleSplitBill: Function }} props - Component props.
 */
function FormSplitBill({ selectedFriendObj, handleSplitBill }) {
  const [bill, setBill] = useState('')
  const [paidByUser, setpaidByUser] = useState('')
  const paidByFriend = (bill) ? (bill - paidByUser) : ("")
  const [whoIsPaying, setwhoIsPaying] = useState('user')

  // Utility function to capitalize the first letter of the friend's name
  const capitalizeFirstLetter = (string) => { if (!string) return ''; return string.charAt(0).toUpperCase() + string.slice(1); };

  /**
  * Handles form submission to split the bill. @param {Event} e - The form submission event.
  */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    handleSplitBill((whoIsPaying === 'user') ? (paidByFriend) : (- paidByUser))
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>{`Split a bill with ${(selectedFriendObj) ? (selectedFriendObj.name) : 'selected friend'}`}</h2>

      <label>💰 Bill Value</label>
      <input type="text" value={bill} onChange={(e) => setBill(Number(e.target.value))} />

      <label>🫵🏾 Your expense</label>
      <input type="text" value={paidByUser} onChange={(e) => setpaidByUser((Number(e.target.value)) > (bill) ? (paidByUser) : (Number(e.target.value)))} />

      <label> {`👯‍♂️ ${selectedFriendObj ? `${capitalizeFirstLetter(selectedFriendObj.name)}'s` : ''} expense`}</label>
      <input type="text" disabled value={paidByFriend} />

      <label>🤑 Who is paying the bill</label>
      <select value={whoIsPaying} onChange={(e) => setwhoIsPaying(e.target.value)} >
        <option value='user' >You</option>
        <option value='friend'>{`${selectedFriendObj ? capitalizeFirstLetter(selectedFriendObj.name) : 'selected friend'}`}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  )
}