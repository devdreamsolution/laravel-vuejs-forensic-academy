
import axios from '@/axios'

export default {
    // Save persional data
    savePersonalData ({ commit }, payload) {
        const { id, name, surname, cpf, sex, date_of_birth, telephone, whatsapp, email, photo } = payload.userDetails

        let formData = new FormData()

        formData.append('name', name)
        formData.append('surname', surname)
        formData.append('cpf', cpf)
        formData.append('sex', sex)
        formData.append('date_of_birth', date_of_birth)
        formData.append('telephone', telephone)
        formData.append('whatsapp', whatsapp)
        formData.append('email', email)
        formData.append('photo', photo)

        return new Promise((resolve, reject) => {
            axios.post(`/api/savePersonalData/${id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
            .then(response => {
                // Update data in localStorage
                commit('UPDATE_USER_INFO', response.data, {root: true})

                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },

    // Remove avatar
    removePhoto ({ commit }, payload) {
        const { id } = payload.userDetails

        return new Promise((resolve, reject) => {
            axios.delete(`/api/removePhoto/${id}`)
            .then(response => {
                commit('UPDATE_USER_INFO', response.data, {root: true})

                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    resetPassword ({ commit }, payload) {
        const { old_password, new_password, confirm_password } = payload
        return new Promise((resolve, reject) => {
            axios.post('/api/resetPassword', {
                old_password: old_password,
                new_password: new_password,
                confirm_password: confirm_password
            }).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // Save social
    saveSocial ({ commit }, payload) {
        const { facebook, instagram, linkedin, twitter } = payload.userDetails

        return new Promise((resolve, reject) => {
            axios.post('/api/saveSocial', {
                facebook: facebook,
                instagram: instagram,
                linkedin: linkedin,
                twitter: twitter
            }).then(response => {
                commit('UPDATE_USER_INFO', response.data, {root: true})

                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }
}
