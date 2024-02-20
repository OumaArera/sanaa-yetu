
import React from 'react';

const ContactPage = () => {
  
  const contactInfo = {
    organizationName: "Sanaa Yetu",
    address: "123 Main Stret",
    email: "sanaayetu@gmail.com",
    phoneNumber: "123-456-7890",
    customerCareNumbers: [
      { department: "Sales", number: "555-111-1111" },
      { department: "Support", number: "555-222-2222" },
      { department: "Billing", number: "555-333-3333" }
    ]
  };

  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <p>Organization: {contactInfo.organizationName}</p>
      <p>Address: {contactInfo.address}</p>
      <p>Email: {contactInfo.email}</p>
      <p>Phone Number: {contactInfo.phoneNumber}</p>

      <h2>Customer Care Numbers:</h2>
      <ul>
        {contactInfo.customerCareNumbers.map((dept, index) => (
          <li key={index}>
            {dept.department}: {dept.number}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContactPage;
