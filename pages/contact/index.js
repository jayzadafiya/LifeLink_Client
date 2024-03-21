export default function Contact() {
  return (
    <section>
      <div className="px-4 mx-auto max-w-screen-md">
        <h2 className="heading text-center">Contact Us</h2>
        <p className="mb-8 lg:mb-16 font-light text-center  text__para">
          Get a technical issue? Want to send feedback about a beta feature? Let
          us know
        </p>
        <form action="">
          <div>
            <label htmlFor="" className="from__label">
              Your Email
            </label>
            <input
              type="email"
              className="form__input mt-1"
              id="email"
              placeholder="example@gmail.com"
            />
          </div>
          <div>
            <label htmlFor="" className="from__label">
              Subject
            </label>
            <input
              type="text"
              className="form__input mt-1"
              id="subject"
              placeholder="Let us know how we can help you"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="" className="from__label">
              Your Message
            </label>
            <textarea
              rows="6"
              type="text"
              className="form__input mt-1"
              id="message"
              placeholder="Leave a comment...."
            />
          </div>
          <button className="btn rounded sm:w-fit" type="submit">
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}
