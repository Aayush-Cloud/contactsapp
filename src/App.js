import React, { useState, useEffect } from 'react';
import './App.css';

export default function Page() {
  const [showForm, setShowForm] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [contacts, setContacts] = useState([]);
  const [contactId, setContactId] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const isFormFilled = firstName && lastName;
  const isFormPartiallyFilled = firstName || lastName;
  const isEmailValid = email.includes('@');

  const toggleEdit = () => {
    if (isEditable) {
      if (!firstName || !lastName ||  (email && !email.includes('@'))) {
        console.log('ok');
      } else {
        setIsEditable(false);
      }
    } else {
      setIsEditable(true);
    }
  };
  useEffect(() => {
    fetch('http://localhost:5005/contacts')
      .then(response => response.json())
      .then(data => setContacts(data));
  }, [firstName, lastName, phoneNumber, email]);

  const editContact = async (event) => {
    event.preventDefault();
    if (!firstName || !lastName || (email && !email.includes('@'))) {
      return;
    }
    const newContact = { id: contactId, firstName, lastName, phoneNumber, email };
    await fetch(`http://localhost:5005/contacts/${contactId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newContact),
    })
    .then(() => {
      setContacts(contacts.map(contact => contact.id === contactId ? newContact : contact));
      setSelectedContact(newContact);
    });
  };
  
const saveContact = (event) => {
    event.preventDefault();
    if (!firstName || !lastName || (email && !email.includes('@')))  {
      
      return;
    }
    const newContact = { firstName, lastName, phoneNumber, email };
    fetch('http://localhost:5005/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newContact),
    })
    .then(response => response.json())
    .then(contact => {
      setContacts([...contacts, contact]);
      setSelectedContact(contact);
    });
  };

  const deleteContact = () => {
    if (selectedContact) {
      fetch(`http://localhost:5005/contacts/${selectedContact.id}`, {
        method: 'DELETE',
      })
      .then(() => {
        const newContacts = contacts.filter(contact => contact.id !== selectedContact.id);
        setContacts(newContacts);
      });
    }
    setSelectedContact(null);
    setFirstName('');
    setLastName('');
    setPhoneNumber('');
    setEmail('');
  };
  
   const addNewContact = () => {
    setShowForm(true);
    setSelectedContact(null);
    setFirstName('');
    setLastName('');
    setPhoneNumber('');
    setEmail('');
    setIsEditable(true);
  };
  
  const selectContact = (contact) => {
    setSelectedContact(contact);
    setFirstName(contact.firstName);
    setLastName(contact.lastName);
    setPhoneNumber(contact.phoneNumber);
    setEmail(contact.email);
    setContactId(contact.id)
    setShowForm(true);
    setIsEditable(false);
   
  };

  return (
    <div className="myDiv" >
      <div className="myDiv2">
       <div className="myDiv3">
        My Contacts</div>
       {contacts.map((contact, index) => (
        <button key={index} onClick={() => selectContact(contact)}
    className={`myButton ${contactId === contact.id ? 'myButtonSelected' : ''}`}>
    {contact.firstName} {contact.lastName}
</button>
))}
<button onClick={addNewContact} 
    className={`myButton2 ${isFormFilled && !selectedContact ? 'myButtonFilled' : ''}`}>
    {isFormPartiallyFilled && !selectedContact ? `${firstName} ${lastName}` : '+ Add New Contact'}
</button>
   </div>
      <div style={{ borderLeft: '1px solid black', height: 'calc(100% - 0px)', marginLeft: '55px' }} />
      <div className="myDiv4">
        {(showForm || selectedContact) && (
          <form onSubmit={(event) => {selectedContact ? editContact(event) : saveContact(event)}} >
            <div style={{ marginBottom: '1rem' }}>
              <label className="myLabel1">
                First Name *
              </label>
              <input type="text" name="firstName" value={firstName}
                    onChange={(e) => setFirstName(e.target.value)} 
                    required className={`myInput ${isEditable ? (firstName ? 'myInputEditable' : 'myInputEditableEmpty') : ''}`}
                    disabled={!isEditable} />
            </div>
            <div className='myDiv5'>
              <label className="myLabel2" >
                Last Name *
              </label>
              <input type="text" name="lastName" value={lastName}
                    onChange={(e) => setLastName(e.target.value)} 
                    required className={`myInput2 ${isEditable ? (lastName ? 'myInputEditable2' : 'myInputEditableEmpty2') : ''}`}
                    disabled={!isEditable} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label className="myLabel3">
                Phone Number
              </label>
              <input type="tel" name="phoneNumber" value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)} 
                   className={`myInput3 ${isEditable ? (phoneNumber ? 'myInputEditable3' : 'myInputEditableEmpty3') : ''}`}
                    disabled={!isEditable} />
         </div>
            <div style={{ marginBottom: '1rem' }}>
              <label className="myLabel4" >
                Email
              </label>
              <input type="email" name="email" value={email}
                onChange={(e) => setEmail(e.target.value)} 
                 className={`myInput4 ${isEditable ? (isEmailValid ? 'myInputEditableValid4' : (email ? 'myInputEditableInvalid4' : 'myInputEditableEmpty4')) : ''}`}
                disabled={!isEditable} />
            </div>
            <div className="myDiv6">
            <button onClick={toggleEdit} 
                className={`myButton3 ${isFormFilled ? 'myButtonFilled3' : ''}`}>
                {!isEditable && selectedContact ? 'Edit' : 'Save'}
            </button>              
            <button type="button" onClick={deleteContact} 
                className={`myButton4 ${selectedContact ? 'myButtonSelected4' : ''}`}>
                {selectedContact ? 'Delete' : 'Cancel'}
            </button>
             </div>
            <div className="myDiv7">
              *required
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

