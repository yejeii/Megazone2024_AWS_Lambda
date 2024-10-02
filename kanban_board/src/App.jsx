// App.jsx
// import './App.css';
import Kanban from './Kanban.jsx';
import { Amplify } from 'aws-amplify';
import { Authenticator  } from "@aws-amplify/ui-react";
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

const App = () => {
    return (
        <Authenticator>
            {({ signOut, user }) => (
                <div>
                    <header>
                        <h3>{user.username}님 접속중</h3>
                        <button onClick={signOut}>Sign Out</button>
                    </header>
                    <Kanban/>
                </div>
            )}
        </Authenticator>
    );
};

export default App;