import { useEffect, useState } from "react";
import './ViewCustomer.css';
import axios from "axios";

const ViewCustomer = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/customers")
      .then(response => setCustomers(response.data))
      .catch(error => console.log(error));
  }, []);

  const handleDelete = (id) => {
    if(window.confirm("Are you sure to delete this customer?")) {
      axios.delete(`http://localhost:3001/customers/${id}`)
        .then(() => {
          setCustomers(customers.filter(c => c.customer_id !== id));
        })
        .catch(error => console.log(error));
    }
  };

  return (
    <div className="view-customer-container">
      <h1 className="customer-title">Customer List</h1>
      <div className="table-responsive">
        <table className="customer-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Contact No</th>
            <th>Email</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.customer_id}>
              <td>{customer.customer_id}</td>
              <td>{customer.customer_name}</td>
              <td>{customer.contact_No}</td>
              <td>{customer.email}</td>
              <td>{customer.location}</td>
              <td><button className="delete-btn" onClick={() => handleDelete(customer.customer_id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default ViewCustomer;
