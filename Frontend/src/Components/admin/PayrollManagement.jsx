import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const PayrollManagement = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [amount, setAmount] = useState('');
  const [payrolls, setPayrolls] = useState([]);

  useEffect(() => {
    // Load payrolls from localStorage when the component mounts
    const storedPayrolls = JSON.parse(localStorage.getItem('payrolls')) || [];
    setPayrolls(storedPayrolls);

    // Fetch payrolls from the server when the component mounts
    axios.get('http://localhost:3000/auth/payrolls')
      .then(response => {
        console.log('Fetched payrolls:', response.data);
        setPayrolls(response.data.payrolls);
        // Store payroll data in localStorage
        localStorage.setItem('payrolls', JSON.stringify(response.data.payrolls));
      })
      .catch(error => {
        console.error('There was an error fetching the payrolls data!', error);
      });
  }, []);

  const handleEmployeeIdChange = (e) => {
    setEmployeeId(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleAddPayroll = (e) => {
    e.preventDefault();
    if (!employeeId.trim() || !amount.trim()) {
      console.error('Employee ID and Amount cannot be empty!');
      return;
    }

    const newPayroll = {
      employeeId: employeeId,
      amount: amount
    };

    console.log('Sending request data:', newPayroll);

    axios.post('http://localhost:3000/auth/payrolls', newPayroll)
      .then(response => {
        console.log('Response from server:', response.data);
        setPayrolls(prevPayrolls => [...prevPayrolls, response.data.payroll]);
        setEmployeeId('');
        setAmount('');
        console.log('Payroll added successfully!');

        // Update localStorage with the new payrolls data
        const updatedPayrolls = [...payrolls, response.data.payroll];
        localStorage.setItem('payrolls', JSON.stringify(updatedPayrolls));
      })
      .catch(error => {
        console.error('There was an error adding the payroll!', error);
      });
  };

  return (
    <div className="container px-5 mt-5">
      <div className="card mb-4">
        <div className="card-header">
          <h4>Add Payroll</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleAddPayroll}>
            <div className="mb-3">
              <label htmlFor="employeeId" className="form-label">Employee ID</label>
              <input
                type="text"
                className="form-control"
                id="employeeId"
                value={employeeId}
                onChange={handleEmployeeIdChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="amount" className="form-label">Amount</label>
              <input
                type="text"
                className="form-control"
                id="amount"
                value={amount}
                onChange={handleAmountChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">Add Payroll</button>
          </form>
        </div>
      </div>
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4>Payrolls</h4>
        </div>
        <div className="card-body">
          <ul className="list-group">
            {payrolls.map(payroll => (
              <li className="list-group-item" key={payroll.id}>
                <span>Employee ID: {payroll.employeeId}, Amount: {payroll.amount}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PayrollManagement;
