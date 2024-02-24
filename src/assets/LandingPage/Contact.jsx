import React from 'react';
import './Contacts.css';

const ContactPage = () => {
  const contactInfo = {
    organizationName: "Sanaa Yetu",
    address: "123 Main Street",
    email: "sanaayetu@gmail.com",
    phoneNumber: "123-456-7890",
    customerCareNumbers: [
      { department: "Sales", number: "555-111-1111" },
      { department: "Support", number: "555-222-2222" },
      { department: "Billing", number: "555-333-3333" }
    ]
  };

  return (
    <div className="card">
      <div className="card-header">
        <h1 className="card-title">Contact Us</h1>
      </div>

      <div className="card-body">
        <p className="contact-info">Organization: {contactInfo.organizationName}</p>
        <p className="contact-info">Address: {contactInfo.address}</p>
        <p className="contact-info">Email: {contactInfo.email}</p>
        <p className="contact-info">Phone Number: {contactInfo.phoneNumber}</p>

        <h2 className="card-subtitle">Customer Care Numbers:</h2>
        <ul className="care-numbers">
          {contactInfo.customerCareNumbers.map((dept, index) => (
            <li key={index}>
              {dept.department}: {dept.number}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ContactPage;