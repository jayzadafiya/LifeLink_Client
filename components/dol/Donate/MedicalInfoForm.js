import { HashLoader } from "react-spinners";

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
      <div className="peronsal_info">
        <h2 className="title">Medical Info</h2>
        <form>
          <div className="form-items">
            <div className="left">
              <label htmlFor="last-donation-date" className="dol_form__label">
                Last Donation Date
              </label>
              <input
                type="date"
                className="dol_form__input"
                name="lastDonationDate"
                value={formData.lastDonationDate}
                onBlur={onBlur}
                onChange={handleChange}
              />
              {errors.lastDonationDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.lastDonationDate}
                </p>
              )}

              <label htmlFor="styling" className="dol_form__label">
                In the last six months have you had any of the following?
              </label>
              <select
                name="styling"
                className="dol_form__input"
                id="disease"
                value={formData.styling}
                onChange={handleChange}
              >
                <option value="">select</option>
                <option value="tattooing">Tattooing </option>
                <option value="ear_piercing">Ear piercing</option>
                <option value="dental_extraction">Dental extraction</option>
              </select>

              <label htmlFor="weight" className="dol_form__label">
                Weight
              </label>
              <input
                type="text"
                className="dol_form__input"
                name="weight"
                placeholder="Enter weight in Kg"
                required
                value={formData.weight}
                onBlur={onBlur}
                onChange={handleChange}
              />
              {errors.weight && (
                <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
              )}
            </div>

            <div className="right">
              <label htmlFor="bloodType" className="dol_form__label">
                Blood Type
              </label>
              <input
                type="text"
                name="bloodType"
                required
                className="dol_form__input"
                placeholder="Enter your blood type"
                value={formData.bloodType}
                onBlur={onBlur}
                onChange={handleChange}
              />
              {errors.bloodType && (
                <p className="text-red-500 text-sm mt-1">{errors.bloodType}</p>
              )}
              <label htmlFor="surgery" className="dol_form__label">
                Is there any history of surgery in the past six months?
              </label>

              <select
                name="surgery"
                className="dol_form__input"
                value={formData.surgery}
                onChange={handleChange}
              >
                <option value="">select</option>
                <option value="major">Major</option>
                <option value="minor">Minor</option>
                <option value="blood_transfusion">Blood Transfusion </option>
              </select>
              <label htmlFor="disease" className="dol_form__label">
                Do you suffer from or have suffered from any diseases?
              </label>
              <input
                type="text"
                className="dol_form__input"
                name="disease"
                placeholder="Enter disease name"
                value={formData.disease}
                onBlur={onBlur}
                onChange={handleChange}
              />
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
