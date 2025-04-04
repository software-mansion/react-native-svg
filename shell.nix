{pkgs ? import <nixpkgs> {}}:
pkgs.mkShell {
  packages = with pkgs; [
    nodejs
    eslint_d
    prettierd
    yarn
  ];
}
