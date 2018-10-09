## Install Nginx

Mac: `brew install nginx`

Linux: http://nginx.org/en/linux_packages.html

Windows: http://nginx.org/en/docs/windows.html



## Trust Root CA

Go to [chrome://settings/privacy](chrome://settings/privacy) and click "Manage certificates", then import  `rootCA.pem`  as Root CA and trust it.

If you have trouble you can refer to https://www.bounca.org/tutorials/install_root_certificate.html for examples on different OS.



## Config hosts file

Config `local.topcoder.com` to `127.0.0.1` in your hosts file:

```properties
127.0.0.1 local.topcoder.com
```

Linux/Mac: `/etc/hosts`

Windows: `C:\Windows\System32\drivers\etc\hosts`



## Config nginx.conf

Config `<path-to-server-crt>` and `<path-to-server-key>` in `nginx.conf` to your correct absolute path:

```properties
events {
    worker_connections  1024;
}

http {
    server {
        listen       443 ssl http2;
        server_name  local.topcoder.com;

    	ssl_certificate      <path-to-server-crt>/server.crt;
    	ssl_certificate_key  <path-to-server-key>/server.key;

    	location / {
            proxy_pass   http://127.0.0.1:3000;
        }
    }
}
```



## Start Nginx

```shell
sudo nginx -c <path-to-nginx-conf>/nginx.conf
```

The server will be started at https://local.topcoder.com , which acts as a proxy to `127.0.0.1:3000`