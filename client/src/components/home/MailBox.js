import { useState } from "react"
import './Home.css'

const MailBox = () => {
    const [to, setTo] = useState()
    const [subject, setSubject]= useState()
    const [body, setBody]= useState()
    const [path, setPath]= useState()
    const [file, setFile] = useState()

    const handleSubmit= (e)=> {
        e.preventDefault();
        const data = new FormData();
        data.append("to", to);
        data.append("subject", subject);
        data.append("body", body);
        data.append("file", file[0]);

        fetch("/home/sendemail", {
            method:"POST",
            body: data,
        }).then((newemail) => {
            console.log("New email:", newemail);

            setTo('')
            setSubject('')
            setBody('')
            setPath('')
            setFile([])
        });
       
    };

    return (
        <div className="mail-container">
            <h1>Mailbox</h1>
            <form encType="multipart/form-data" onSubmit={handleSubmit}>
                <div className="form-input">
                    <input
                        type="email"
                        name="to"
                        placeholder="To:"
                        required
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                    />
                </div>
                <div className="form-input">
                    <input
                        type="text"
                        name="subject"
                        placeholder="Subject:"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                </div>
                <div className="form-input">
                    <textarea
                        name="body"
                        placeholder="Body"
                        col="30"
                        rows="10"
                        required
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    />
                </div>
                <div className="attach">
                    <label htmlFor="attachment">Attachment:</label>
                    <input
                        type="file"
                        name="image"
                        value={path}
                        required
                        onChange={(e) => {
                            setPath(e.target.value);
                            setFile(e.target.files);
                        }}
                    />
                </div>
                <div className="btn-send">
                    <button>Send</button>
                </div>
{/* 
                <p>{to}</p>
                <p>{subject}</p>
                <p>{body}</p> */}
            </form>
        </div>
    );
};
 
export default MailBox;