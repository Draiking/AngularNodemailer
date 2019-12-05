recoveryPassword(email) {
    const url = `https://my-data-url.cloudfunctions.net/sendMail`;

    return this.http.post(url, {email, hash: md5(email)}, {responseType: 'text' as 'json'}).toPromise()
        .then((res) => {
            console.log(email);
            console.log(res);
            return res;
        })
        .catch(err => {
            console.log(err);
        });

}
