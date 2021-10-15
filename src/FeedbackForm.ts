import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export class FeedbackForm extends LitElement {

  @property({ type: String }) url = 'http://localhost:4000/api/feedbacks';
  @property({ type: Boolean }) displaySuccess = false;
  @property({ type: Boolean }) displayForm = false;

  openFeedback(e: Event) { this.displayForm = true; }

  static styles = css`
    input, textarea {
      display: block;
    }
    * {
      font-family: Arial;
    }
  `;

  formDataAsJSON(form: HTMLFormElement) {
    const formData = new FormData(form)
    const data: { [k: string]: any } = {};
    formData.forEach((value, key) => (data[key] = value))
    return JSON.stringify(data);
  }

  async submitFeedback(event: Event) {
    event.preventDefault()
    const response = await fetch(this.url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: this.formDataAsJSON(event.target as HTMLFormElement)
    });
    this.displayForm = false;
    this.displaySuccess = true;
  }

  render() {
    return html`
      ${this.displayForm ? html`
        <form @submit=${this.submitFeedback} part="form">
          <div part="input-group">
            <label>Name</label>
            <input name="name" part="input"></input>
          </div>
          <div part="input-group">
            <label>Email</label>
            <input name="email" part="input"></input>
          </div>
          <div part="input-group">
            <label>Message</label>
            <textarea name="message" part="input"></textarea>
          </div>
          <button part="submit-button">Send Feedback</button>
        </form>
      ` : html`
        <button @click=${this.openFeedback} part="open-feedback-button" slot="open-feedback">Feedback!</button>
      `}
      ${this.displaySuccess ? html`
        <slot name="success"><h1>You submitted some feedback!! Great job!!</h1></slot>
      ` : ''}
    `;
  }
}
