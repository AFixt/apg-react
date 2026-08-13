import React from 'react';
import { mount } from './mount';

const employees = [
  { name: 'Alice', department: 'Engineering', location: 'Austin' },
  { name: 'Bob', department: 'Marketing', location: 'Denver' },
  { name: 'Carol', department: 'Sales', location: 'Chicago' },
];

/**
 * Table demo: a static data table of employees.
 *
 * The APG Table pattern is native `<table>` markup, not an ARIA widget — no
 * apg-react component implements it, so this demo is plain HTML with a
 * caption for the accessible name and `<th scope="col">` header cells rather
 * than a `role="table"` reimplementation.
 */
function TableDemo(): React.ReactElement {
  return (
    <main className="demo-page">
      <h1>Table</h1>
      <table>
        <caption>Employees</caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Department</th>
            <th scope="col">Location</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.name}>
              <td>{employee.name}</td>
              <td>{employee.department}</td>
              <td>{employee.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

mount(<TableDemo />);
