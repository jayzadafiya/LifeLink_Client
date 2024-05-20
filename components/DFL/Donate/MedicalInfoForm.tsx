import { HashLoader } from "react-spinners";
import style from "../../../styles/DFL/donate.module.scss";
import { DonorForm } from "../../../interfaces/Forms";

interface MedicalInfoFormProps {
  formData: DonorForm;
  loading: boolean;
  onSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onChange: (name: string, value: string) => void;
  errors: Partial<DonorForm>;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function MedicalInfoForm({
  formData,
  loading,
  onSubmit,
  onChange,
  errors,
  onBlur,
}: MedicalInfoFormProps): React.JSX.Element {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value }: { name: string; value: string } = e.target;
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

                <select
                  name="bloodType"
                  required
                  onBlur={onBlur}
                  value={formData.bloodType}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
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
                  <option value="">None</option>
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
                  <option value="">None</option>
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
