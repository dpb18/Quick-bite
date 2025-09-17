import { useEffect, useState } from "react";
import './ViewDeliveryPartner.css';
import axios from "axios";

const ViewDeliveryPartner = () => {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/delivery-partners")
      .then(response => setPartners(response.data))
      .catch(error => console.log(error));
  }, []);

  const handleDelete = (id) => {
    if(window.confirm("Are you sure to delete this delivery partner?")) {
      axios.delete(`http://localhost:3001/delivery-partners/${id}`)
        .then(() => {
          setPartners(partners.filter(p => p.partner_id !== id));
        })
        .catch(error => console.log(error));
    }
  };

  return (
    <div className="view-partner-container">
      <h1 className="partner-title">Delivery Partner List</h1>
      <div className="table-responsive">
        <table className="partner-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Password</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {partners.map(partner => (
            <tr key={partner.partner_id}>
              <td>{partner.partner_id}</td>
              <td>{partner.name}</td>
              <td>{partner.phone}</td>
              <td>{partner.email}</td>
              <td>{partner.pasword}</td>
              <td><button className="delete-btn" onClick={() => handleDelete(partner.partner_id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default ViewDeliveryPartner;
