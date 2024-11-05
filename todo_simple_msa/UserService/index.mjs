import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';          // Local Strategy
import * as User from './users.js';

const app = express();
app.use(express.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));

// 미들웨어 추가
app.use(passport.initialize());
app.use(passport.session());

// Local Strategy 를 통한 로그인 인증 (Passport)
// 로그인 전략을 실행하고, done()을 호출하면, 다시 passport.authenticate() 라우터로 돌아가 다음 미들웨어를 실행
passport.use(new LocalStrategy(
    (username, password, done) => {
        const user = User.findUser(username);
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }

        if (user.password !== password) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    }
));

// Object -> JSON
// 인증 후 사용자 정보를 세션에 저장
passport.serializeUser((user, done) => {
    console.log("serializeUser, user : " + user);
    done(null, user.id);
});

// JSON -> Object
// 인증 후 세션에서 사용자 정보를 복원
passport.deserializeUser((id, done) => {
    const user = User.findUserById(id);
    console.log("deserializeUser, user : " + user);
    done(null, user);
});

// Local Strategy
app.post('/login', passport.authenticate('local'), (req, res) => {
    res.json({ message: 'Logged in successfully' });
});

app.get('/users', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    res.json(User.users);
});

app.get('/logout', (req, res, next) => {
    // passport 정보 삭제
    req.logOut(err => {
        if(err) {
            return next(err);
        } else {
            // 서버측 세션 삭제
            req.session.destroy(() => {
                // 클라이언트 측 세션 암호화 쿠키 삭제
                res.cookie('connect.sid', '', {maxAge: 0});
                return res.status(201).json({message: 'Logout successfully!'});
            });
        }
    });
})

app.listen(3001, () => {
    console.log('UserService is running on port 3001');
});