import { app } from './app'
import packageJson from '../package.json'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`🚀 Server v${packageJson.version} running on port ${PORT}`);
})