import { useState } from 'react';
import { post } from '../../api.js';
import { Panel, useToast } from '../../components/ui.jsx';

export default function Feedback() {
    const toast = useToast();
    const [rating, setRating] = useState(0);
    const [text, setText] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        if (!rating) { toast('Please choose a star rating', 'error'); return; }
        try {
            await post('feedback.php', 'send', { rating, message: text });
            toast('Thank you! Your feedback was submitted.');
            setRating(0); setText('');
        } catch (err) {
            toast(err.message, 'error');
        }
    };

    return (
        <div className="row justify-content-center"><div className="col-lg-8">
            <Panel title="We value your feedback"><div className="panel-body">
                <p className="text-muted">Your feedback helps us improve SHBS and provide a better experience for everyone.</p>
                <form onSubmit={submit}>
                    <div className="mb-3">
                        <label className="form-label d-block">Rate our system</label>
                        <div className="star-rating">
                            {[1, 2, 3, 4, 5].map((n) => (
                                <i key={n} className={`bi ${n <= rating ? 'bi-star-fill on' : 'bi-star'}`} onClick={() => setRating(n)} role="button" aria-label={`${n} star`} />
                            ))}
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="fb">Your feedback</label>
                        <textarea id="fb" className="form-control" rows="5" placeholder="Tell us what you think..." required value={text} onChange={(e) => setText(e.target.value)} />
                    </div>
                    <div className="alert alert-info small"><i className="bi bi-info-circle me-1" />All feedback is confidential and used only for improvement.</div>
                    <button className="btn btn-shbs" type="submit"><i className="bi bi-send me-1" />Submit feedback</button>
                </form>
            </div></Panel>
        </div></div>
    );
}
