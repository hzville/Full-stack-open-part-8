import { useMutation } from "@apollo/client"
import React, { useState } from "react"
import { EDIT_AUTHOR } from '../graphqlQueries/editAuthor'
import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../graphqlQueries/allAuthorsQuery'


const SetBirthday = () => {

    const authors = useQuery(ALL_AUTHORS, {
        pollInterval: 2000
      })

    const [name, setName] = useState('')
    const [year, setYear] = useState('')

    const [ editAuthor ] = useMutation(EDIT_AUTHOR)

    const submit = async (event) => {
        event.preventDefault()

        editAuthor({ variables: {name, year}})

        setName('')
        setYear('')

    }

    return(
        <div>
            <h2>Set Birthday </h2>
            <form onSubmit={submit}>
                <div>name
                    <select
                        value={name}
                        onChange={e => setName(e.target.value)}
                    >
                        <option value="" disabled selected>Select author</option>
                        {authors.data.allAuthors.map((author) => (
                            <option key={author.name} value={author.name}>{author.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    born
                    <input 
                        type="number"
                        value={year}
                        onChange={({ target }) => setYear(Number(target.value))}
                    />
                </div>
                <button type="submit">Update author</button>
            </form>
        </div>
    )
}

export default SetBirthday