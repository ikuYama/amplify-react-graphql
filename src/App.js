import React, { useState, useEffect } from 'react';
import './App.css';
import { withAuthenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css';
import { API } from 'aws-amplify';
import { listNotes } from './graphql/queries';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations';
 
const initialFormState = { name: '', pjcode: '', startat: '', endat: '', workstyle: '' }
 
function App({ signOut }) {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
 
  useEffect(() => {
    fetchNotes();
  }, []);
 
  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    setNotes(apiData.data.listNotes.items);
  }
 
  async function createNote() {
    if (!formData.name || !formData.pjcode || !formData.startat || !formData.endat || !formData.workstyle) return;
    await API.graphql({ query: createNoteMutation, variables: { input: formData } });
    setNotes([ ...notes, formData ]);
    setFormData(initialFormState);
  }

  async function deleteNote({ id }) {
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({ query: deleteNoteMutation, variables: { input: { id } }});
  }
  return (
    <div className="App">
      <h1>勤怠管理</h1>
      <div>
        <label>氏名　</label>
        <input
          onChange={e => setFormData({ ...formData, 'name': e.target.value})}
          value={formData.name}
        />
      </div>
      <div>
        <label>プロジェクト番号　</label>
        <input type="number" min="0"
          onChange={e => setFormData({ ...formData, 'pjcode': e.target.value})}
          value={formData.pjcode}
        />
      </div>
      <br />
      <div>
        <label>勤務形態　</label><br />
        <input type="radio" name="workstyle"
          onChange={e => setFormData({ ...formData, 'workstyle': '事務所' })}
          value={formData.workstyle}/>  事務所    
        <input type="radio" name="workstyle"
          onChange={e => setFormData({ ...formData, 'workstyle': 'テレワーク' })}
          value={formData.workstyle}/>   テレワーク  
      </div>
      <br />
      <div>
        <label>始業時刻　</label>
        <input type="datetime-local"
          onChange={e => setFormData({ ...formData, 'startat': e.target.value })}
          value={formData.startat}
        />
      </div>
      <div>
        <label>終業時刻　</label>
        <input type="datetime-local"
          onChange={e => setFormData({ ...formData, 'endat': e.target.value })}
          value={formData.endat}
        />
      </div>
      <br />
      <button onClick={createNote}>勤怠入力</button>
      <div>
      <br /> 
        <table align="center" border="1" style={{'border-collapse': 'collapse'}}>
          <tr>
              <th>氏名</th>
              <th>プロジェクト番号</th>
              <th>始業時刻</th>
              <th>終業時刻</th>
              <th>勤務形態</th>
              <th>削除</th>
            </tr>
          {notes.map((note) => {
            return(
              <tr key={note.id}>
                <td>{note.name}</td>
                <td>{note.pjcode}</td>
                <td>{note.startat}</td>
                <td>{note.endat}</td>
                <td>{note.workstyle}</td>
                <td><button onClick={() => deleteNote(note)}>Delete</button></td>
              </tr>
            )
          })}
        </table>
      </div>
      <br /> 
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}
 
export default withAuthenticator(App);