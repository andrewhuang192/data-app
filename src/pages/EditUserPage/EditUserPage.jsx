import React, {useState, useEffect, useRef} from 'react';
import {Link} from 'react-router-dom';

export default function EditUserPage({ user, handleUpdatedUser }){

  // const location = useLocation()

  const [invalidForm, setValidForm] = useState(true);
  const [formData, setFormData] = useState(user)
  
  const formRef = useRef();
  // console.log({user})

  useEffect(() => {
      formRef.current.checkValidity() ? setValidForm(false) : setValidForm(true)
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault()
    handleUpdatedUser(formData);
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      <h1>Edit User</h1>
      <form ref={formRef} autoComplete="off" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>User Name (required)</label>
          <input
            className="form-control"
            name="name"
            value={ formData.name}
            onChange={ handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>User Email (required)</label>
          <input
            className="form-control"
            name="email"
            value={ formData.email}
            onChange={ handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Created Date</label>
          <div
            className="form-control"
            name="date"
            value={ formData.createdAt }
            onChange={ handleChange}
          />
          {user.createdAt}
        </div>
        <button
          type="submit"
          className="btn btn-lg"
          disabled={invalidForm}
        >
          SAVE PROFILE
        </button>
        &nbsp;&nbsp;
        <Link to='/'>CANCEL</Link>
      </form>
    </>
  );
}