import React, { Component } from 'react';
import './App.css';
import loader from './img/loader.gif';

async function talkToServer(url = '', data = {}) {
    try {
        // Default options are marked with *
        const response = await fetch(url, {
            method: data.method, // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': 'PMAK-5ef63db179d23c004de50751-10300736bc550d2a891dc4355aab8d7a5c',
            },
            body: JSON.stringify(data.payload)
        });
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response.json(); // parses JSON response into native JavaScript objects
    } catch(error) {
        // below is exception occurred while talking to server.
        console.log(error);
    }
}

export default class Todo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            loading: true,
        };
    }

    componentDidMount() {
        talkToServer('https://944ba3c5-94c3-4369-a9e6-a509d65912e2.mock.pstmn.io/get', {method: 'GET'})
            .then(data => {
               data = data.sort(function(a,b){
                    // Turn your strings into dates, and then subtract them
                    // to get a value that is either negative, positive, or zero.
                    return (a.dueDate ? new Date(a.dueDate) : new Date()) - (b.dueDate ? new Date(b.dueDate) : new Date());
                });
                data = data.sort(function(a, b){
                    return a.isComplete - b.isComplete;
                });
                // console.log(data);
                this.setState({
                    data:data,
                    loading: false,
                })
            });
    }


    onChecked = (e) => {
        const newList = JSON.parse(JSON.stringify(this.state.data));
        newList[e.target.id].isComplete = !newList[e.target.id].isComplete;
        talkToServer('https://944ba3c5-94c3-4369-a9e6-a509d65912e2.mock.pstmn.io/patch/'+ e.target.id, {method: 'PATCH',
            payload: {
                "isComplete": true
            }
        }).then(data => {
            // if response is success then only update the state.
            if (data && data.status === 'success') {
                this.setState({
                    data: newList
                })
            }
        })
    }

    render() {
        return(
            <div className={'container'}>
                {
                    this.state.loading ? <img src={loader} className={'loader'} alt="Logo" /> :
                        <div className={'todoListContainer'}>
                            <ul>
                                {
                                    this.state.data && this.state.data.map((list, index) => {
                                        let receivedDate = list.dueDate ? new Date(list.dueDate) : '';
                                        let updatedDate = (receivedDate && ((receivedDate.getMonth() > 8) ?
                                            (receivedDate.getMonth() + 1) :
                                            ('0' + (receivedDate.getMonth() + 1))) + '/' +
                                            ((receivedDate.getDate() > 9) ?
                                                receivedDate.getDate() :
                                                ('0' + receivedDate.getDate())) + '/' +
                                            receivedDate.getFullYear());
                                        const currentDate = new Date();
                                        let currentStatus = list.isComplete ?
                                            'Completed' :
                                                (receivedDate ? (receivedDate < currentDate ?
                                                    'Overdue' :
                                                        'Upcoming') :
                                                    'Upcoming');

                                        return (
                                            <li key={list.id} className={`status${currentStatus}`}>
                                                <span className={`${list.isComplete ? 'strickedOff' : '' } todoDesc`}><input type={'checkbox'} name={'todochekbox'} id={index} onChange={this.onChecked} checked={list.isComplete}/>{list.description}</span>
                                                {
                                                    updatedDate && <span className={'todoDueDate'}>{updatedDate}</span>
                                                }
                                            </li>
                                        )
                                    }

                                    )
                                }
                            </ul>
                        </div>
                }

            </div>
        );
    }
}
