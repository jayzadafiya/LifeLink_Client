import { HashLoader } from "react-spinners";
import style from "../../../styles/DFL/donate.module.scss";

export default function MedicalInfoForm({
  formData,
  loading,
  onSubmit,
  onChange,
  errors,
  onBlur,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };
  return (
    <div>
      <div className={style.peronsal_info}>
        <h2 className={style.title}>Medical Info</h2>
        <form>
          <div className={style.form_items}>
            <div className={style.form_row}>
              <div>
                <label htmlFor="last-donation-date">Last Donation Date</label>
                <input
                  type="date"
                  name="lastDonationDate"
                  value={formData.lastDonationDate}
                  onBlur={onBlur}
                  onChange={handleChange}
                />
                {errors.lastDonationDate && <p>{errors.lastDonationDate}</p>}
              </div>
              <div>
                <label htmlFor="bloodType">Blood Type</label>
                <input
                  type="text"
                  name="bloodType"
                  required
                  placeholder="Enter your blood type"
                  value={formData.bloodType}
                  onBlur={onBlur}
                  onChange={handleChange}
                />
                {errors.bloodType && <p>{errors.bloodType}</p>}
              </div>
            </div>

            <div className={style.form_row}>
              <div>
                <label htmlFor="styling">
                  In the last six months have you had any of the following?
                </label>
              </div>
              <div>
                <label htmlFor="surgery">
                  Is there any history of surgery in the past six months?
                </label>
              </div>
            </div>
            <div className={style.form_row}>
              <div>
                <select
                  name="styling"
                  id="disease"
                  value={formData.styling}
                  onChange={handleChange}
                >
                  <option value="">select</option>
                  <option value="tattooing">Tattooing </option>
                  <option value="ear_piercing">Ear piercing</option>
                  <option value="dental_extraction">Dental extraction</option>
                </select>
              </div>
              <div>
                <select
                  name="surgery"
                  value={formData.surgery}
                  onChange={handleChange}
                >
                  <option value="">select</option>
                  <option value="major">Major</option>
                  <option value="minor">Minor</option>
                  <option value="blood_transfusion">Blood Transfusion </option>
                </select>
              </div>
            </div>

            <div className={style.form_row}>
              <div>
                <label htmlFor="weight">Weight</label>
              </div>
              <div>
                <label htmlFor="disease">
                  Do you suffer from or have suffered from any diseases?
                </label>
              </div>
            </div>
            <div className={style.form_row}>
              <div>
                <input
                  type="text"
                  name="weight"
                  placeholder="Enter weight in Kg"
                  required
                  value={formData.weight}
                  onBlur={onBlur}
                  onChange={handleChange}
                />
                {errors.weight && <p>{errors.weight}</p>}
              </div>
              <div>
                <input
                  type="text"
                  name="disease"
                  placeholder="Enter disease name"
                  value={formData.disease}
                  onBlur={onBlur}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <button type="submit" onClick={onSubmit}>
            {loading ? <HashLoader size={25} color="#ffffff" /> : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
