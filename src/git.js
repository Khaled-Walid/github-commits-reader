import FS from '@isomorphic-git/lightning-fs';
import webHttp from 'isomorphic-git/http/web';

export const fs = new FS('commit-renamer');

export const http = webHttp;

export const corsProxy = 'https://cors.isomorphic-git.org';
