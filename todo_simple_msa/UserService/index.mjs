import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';   // OAuth Stretegy
import * as User from './users.js';

const app = express();
app.use(express.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));

// 미들웨어 추가
// app.use(passport.initialize());
// app.use(passport.session());

// OAuth Strategy 를 통한 로그인 인증
passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://www.example.com/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log('google profile : ', profile);
        try {
            const exUser = await User.findOne({
                // 구글 플랫폼에서 로그인 했고 & snsId필드에 구글 아이디가 일치할경우
                where: { snsId: profile.id, provider: 'google' },
            });

            // 이미 가입된 구글 프로필이면 성공
            if(exUser) {
                console.log('Existing user:', exUser);
                done(null, exUser); // 로그인 인증 완료
            } else {
                // 가입되지 않은 유저 0 -> 회원가입 & 로그인
                const newUser = await User.create({
                    email: profile?.email[0].value,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'google',
                });
                console.log('New user:', newUser);
                done(null, newUser);
            }
        } catch (e) {
            console.error(e);
            done(e);
        }
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

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });


// 브라우저에서 http://localhost:3001/auth/google 로 접속
app.listen(3001, () => {
    console.log('UserService is running on port 3001');
});