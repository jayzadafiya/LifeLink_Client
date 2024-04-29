import Image from "next/image";
import donateLogo from "../../../public/assets/images/dol/donate logo.png";

export default function PersonalInfoForm({
  formData,
  onNextClick,
  onChange,
  onBlur,
  errors,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <>
      <div className="peronsal_info">
        <div className="form_header">
          <div className="header_logo">
            <Image
              src={donateLogo}
              alt=""
              width={400}
              className="header-logo-left"
            />
          </div>
          <div className="header_text ">
            <h1>Blood Donation Form</h1>
            <p>
              Please answer the following questions correctly. This will help to
              protect you and the patient who receives your blood.
            </p>
          </div>
        </div>
        <form>
          <div className="form-items">
            <div className="left">
              <label htmlFor="name" className="dol_form__label">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                autoComplete="name"
                required
                value={formData.name}
                className="dol_form__input"
                placeholder="Name"
                onChange={handleChange}
                onBlur={onBlur}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}

              <label htmlFor="email" className="dol_form__label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                className="dol_form__input"
                placeholder="E-mail"
                onBlur={onBlur}
                onChange={handleChange}
                readOnly
                aria-readonly
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}

              <label htmlFor="dob" className="dol_form__label">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                className="dol_form__input"
                id="dob"
                value={formData.dob}
                onBlur={onBlur}
                onChange={handleChange}
              />
              {errors.dob && (
                <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
              )}

              <label htmlFor="gender" className="dol_form__label">
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                className="dol_form__input"
                required
                value={formData.gender}
                onBlur={onBlur}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
              )}
            </div>

            <div className="right">
              <div className="dol_form__label">
                <label htmlFor="addharCard" className="dol_form__label">
                  Addhar card No
                </label>
                <input
                  type="text"
                  name="addharCard"
                  required
                  value={formData.addharCard}
                  className="dol_form__input"
                  placeholder="xxxx-xxxx-xxxx"
                  onBlur={onBlur}
                  onChange={handleChange}
                />
                {errors.addharCard && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.addharCard}
                  </p>
                )}
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="number"
                  id="phone"
                  name="phone"
                  autoComplete="mobile"
                  required
                  value={formData.phone}
                  className="dol_form__input"
                  placeholder="Phone Number"
                  onBlur={onBlur}
                  onChange={handleChange}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}

                <label htmlFor="adress" className="dol_form__label">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  className="dol_form__input"
                  placeholder="Enter your address"
                  onBlur={onBlur}
                  onChange={handleChange}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}

                <label htmlFor="city" className="dol_form__label">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  className="dol_form__input"
                  placeholder="Enter city name"
                  onBlur={onBlur}
                  onChange={handleChange}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>
            </div>
          </div>
          <button type="submit" onClick={onNextClick}>
            Next
          </button>
        </form>
      </div>
    </>
  );
}
