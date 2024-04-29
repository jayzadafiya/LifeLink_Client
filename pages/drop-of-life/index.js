// import styles from "./home.module.scss";
import Image from "next/image";
import Link from "next/link";

import donate from "../../public/assets/images/dol/donate.jpg";
import registration from "../../public/assets/images/dol/registration.jpg";
import refreshment from "../../public/assets/images/dol/refreshment.jpg";
import bloodcheck from "../../public/assets/images/dol/bloodcheck.jpg";
import donation from "../../public/assets/images/dol/donation.jpg";
import Card from "@/components/DOL/Card";

export default function () {
  return (
    <>
      <div className="banner ">
        <div className="content">
          <h1>A DROP FOR LIFE</h1>
          <p>
            “Blood Donation Is A Small Act Of Kindness That Does Great And Big
            Wonders.”
          </p>

          <div>
            <Link href="/drop-of-life/donate">
              <button type="button">DONATE</button>
            </Link>
            <Link href="/drop-of-life/request">
              <button type="button">REQUEST</button>
            </Link>
          </div>
        </div>
      </div>

      <div className="firstblock">
        <div className="text">
          <p>
            Patients' families in underdeveloped nations like <span>Nepal</span>
            bear the responsibility and worry of managing and transporting
            blood.
          </p>
          <p>
            <span>We're working hard to fix that.</span>
          </p>
        </div>

        <div className="img-container">
          <Image
            src={donate}
            className="donate"
            width={800}
            height={500}
            alt=""
          />
        </div>
      </div>

      <div className="reasons-to-donate">
        <h2>5 Reasons to donate blood</h2>
        <ol>
          <li> 1/3 of us will need a blood transfusion in our lifetime.</li>
          <li>
            3 lives can be saved with the amount of blood donated in one
            sitting.
          </li>
          <li> Every 2 seconds someone in the world needs blood.</li>
          <li>
            62 countries got sufficient blood supplies from voluntary donations.
          </li>
          <li>
            It takes 36 hours to naturally replace blood lost from the body.
          </li>
        </ol>
        <h3>
          “Donate Blood Because You Never Know How Helpful It Might Be To
          Someone.”
        </h3>
      </div>

      <div>
        <div className="process">
          <h3>DONATION PROCESS</h3>
          <p>
            The donation process from the time you arrive at center until the
            time you leave
          </p>
        </div>
        <div className="card-container ">
          <div className="cards">
            <Card
              title="REGISTRATION"
              img={registration}
              text=" You need to complete a very simple registration form which
                contatins all required contact information to enter in the
                donation process."
            />
            <Card
              title="SCREENING"
              img={bloodcheck}
              text="A drop of blood from your finger will be taken for a simple test
                to ensure that your blood levels are proper enough for donation."
            />
          </div>

          <div className="cards">
            <Card
              title="DONATION"
              img={donation}
              text="After passing screening test successfully you will be directed
                to a donor bed for donation. It will take only 6-10 minutes."
            />
            <Card
              title="REFRESHMENT"
              img={refreshment}
              text="  you can also stay in the sitting room until you feel strong
                enough to leave the center. You will receive refreshments in the
                donation zone"
            />
          </div>
        </div>
      </div>
    </>
  );
}
