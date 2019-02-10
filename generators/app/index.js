const Generator = require("yeoman-generator")
const kebabCase = require("lodash.kebabcase")

module.exports = class extends Generator {
  async prompting() {
    this.answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname.replace(/\s/g, "-"),
        filter: x => kebabCase(x).toLowerCase(),
      },
      {
        name: "devDep",
        message: "Should people install this as one of their devDependencies?",
        default: true,
        type: "confirm",
      },
      {
        type: "confirm",
        name: "semver",
        message: "Should this use semantic-release?",
        default: true,
      },
      {
        type: "input",
        name: "description",
        message: "Your project description",
      },
    ])
  }

  writing() {
    const mv = (from, to) => {
      this.fs.move(this.destinationPath(from), this.destinationPath(to))
    }

    this.fs.copyTpl([`${this.templatePath()}/**`], this.destinationPath(), {
      ...this.answers,
    })

    mv("gitattributes", ".gitattributes")
    mv("gitignore", ".gitignore")
    mv("travis.yml", ".travis.yml")
    mv("_package.json", "package.json")
    mv("github/ISSUE_TEMPLATE.md", ".github/ISSUE_TEMPLATE.md")
    mv("github/PULL_REQUEST_TEMPLATE.md", ".github/PULL_REQUEST_TEMPLATE.md")
    mv("github/USERS.md", ".github/USERS.md")
    mv("_.eslintrc.js", ".eslintrc.js")
    mv("_.prettierignore", ".prettierignore")
    mv("_.prettierrc.js", ".prettierrc.js")
    mv("_tsconfig.json", "tsconfig.json")
  }

  install() {
    this.spawnCommand("git", ["init"])
    this.yarnInstall(
      [
        "gd-scripts",
        "@types/node"
      ],
      { "dev": true ,exact:true},
    )
    // this.installDependencies({ bower: false, npm: false })
  }
}
