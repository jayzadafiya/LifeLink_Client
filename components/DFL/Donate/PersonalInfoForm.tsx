import Image from "next/image";
import donateLogo from "../../../public/assets/images/dfl/donate logo.png";

import style from "../../../styles/DFL/donate.module.scss";
import { DonorForm } from "../../../interfaces/Forms";

// Interface for props
interface PersonalInfoFormProps {
  formData: DonorForm;
  onNextClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onChange: (name: string, value: string) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
  errors: Partial<DonorForm>;
}

export default function PersonalInfoForm({
  formData,
  onNextClick,
  onChange,
  onBlur,
  errors,
}: PersonalInfoFormProps): React.JSX.Element {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value }: { name: string; value: string } = e.target;
    onChange(name, value);
  };

  return (
    <>
      <div className={style.peronsal_info}>
        <div className={style.form_header}>
          <div className={style.header_logo}>
            <Image
              src={donateLogo}
              alt=""
              width={400}
              className="header-logo-left"
            />
          </div>
          <div className={style.header_text}>
            <h1>Blood Donation Form</h1>
            <p>
              Please answer the following questions correctly. This will help to
              protect you and the patient who receives your blood.
            </p>
          </div>
        </div>
        <form>
          <div className={style.form_items}>
            <div className={style.form_row}>
              <div>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="name"
                  required
                  value={formData.name}
                  className={style.dfl_form__input}
                  placeholder="Name"
                  onChange={handleChange}
                  onBlur={onBlur}
                />
                {errors.name && <p>{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="addharCard">Addhar card No</label>
                <input
                  type="text"
                  name="addharCard"
                  required
                  value={formData.addharCard}
                  className={style.dfl_form__input}
                  placeholder="xxxx-xxxx-xxxx"
                  onBlur={onBlur}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={style.form_row}>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  className={style.dfl_form__input}
                  placeholder="E-mail"
                  onBlur={onBlur}
                  onChange={handleChange}
                  readOnly
                  aria-readonly
                />
                {errors.email && <p>{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  autoComplete="mobile"
                  required
                  value={formData.phone}
                  className={style.dfl_form__input}
                  placeholder="Phone Number"
                  onBlur={onBlur}
                  onChange={handleChange}
                />
                {errors.phone && <p>{errors.phone}</p>}
              </div>
            </div>

            <div className={style.form_row}>
              <div>
                <label htmlFor="dob">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  className={style.dfl_form__input}
                  id="dob"
                  value={formData.dob}
                  onBlur={onBlur}
                  onChange={handleChange}
                />
                {errors.dob && <p>{errors.dob}</p>}
              </div>
              <div>
                <label htmlFor="adress">Address</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  className={style.dfl_form__input}
                  placeholder="Enter your address"
                  onBlur={onBlur}
                  onChange={handleChange}
                />
                {errors.address && <p>{errors.address}</p>}
              </div>
            </div>

            <div className={style.form_row}>
              <div>
                <label htmlFor="gender">Gender</label>
                <select
                  name="gender"
                  id="gender"
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
                {errors.gender && <p>{errors.gender}</p>}
              </div>
              <div>
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  placeholder="Enter city name"
                  onBlur={onBlur}
                  onChange={handleChange}
                />
                {errors.city && <p>{errors.city}</p>}
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
