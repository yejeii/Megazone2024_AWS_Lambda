export const users = [
    { id: 1, email: 'user1@example.com', password: 'password1', nick: 'User1', snsId: null, provider: null },
    { id: 2, email: 'user2@example.com', password: 'password2', nick: 'User2', snsId: null, provider: null }
];

export function findUser(username) {
    return users.find(user => user.username === username);
}

export function findUserById(id) {
    return users.find(user => user.id === id);
}

export function findOne(criteria) {
    return users.find(user => {
        // 모든 주어진 조건이 일치하는 경우에만 반환
        return Object.keys(criteria).every(key => user[key] === criteria[key]);
    });
}

export function create(newUser) {
    const id = users.length ? users[users.length - 1].id + 1 : 1; // 새로운 ID 생성
    const user = { id, ...newUser };
    users.push(user); // 배열에 새 사용자 추가
    return user;
}