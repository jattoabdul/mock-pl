const createSession = async (request, user) => {
  return await request
    .post('/api/v1/auth/login')
    .send({
      email: user.email,
      password: user.password
    })
    .expect(200)
    .expect('set-cookie', /user_sid/)
}

module.exports = {
  createSession
}
