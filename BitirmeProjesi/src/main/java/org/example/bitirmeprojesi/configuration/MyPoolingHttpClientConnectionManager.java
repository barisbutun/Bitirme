package org.example.bitirmeprojesi.configuration;

import org.apache.http.concurrent.FutureCallback;
import org.apache.http.conn.routing.HttpRoute;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.nio.NHttpClientConnection;
import org.apache.http.nio.conn.NHttpClientConnectionManager;
import org.apache.http.nio.reactor.IOEventDispatch;
import org.apache.http.protocol.HttpContext;

import java.io.IOException;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

public class MyPoolingHttpClientConnectionManager extends PoolingHttpClientConnectionManager implements NHttpClientConnectionManager {
    @Override
    public Future<NHttpClientConnection> requestConnection(HttpRoute httpRoute, Object o, long l, long l1, TimeUnit timeUnit, FutureCallback<NHttpClientConnection> futureCallback) {
        return null;
    }

    @Override
    public void releaseConnection(NHttpClientConnection nHttpClientConnection, Object o, long l, TimeUnit timeUnit) {

    }

    @Override
    public void startRoute(NHttpClientConnection nHttpClientConnection, HttpRoute httpRoute, HttpContext httpContext) throws IOException {

    }

    @Override
    public void upgrade(NHttpClientConnection nHttpClientConnection, HttpRoute httpRoute, HttpContext httpContext) throws IOException {

    }

    @Override
    public void routeComplete(NHttpClientConnection nHttpClientConnection, HttpRoute httpRoute, HttpContext httpContext) {

    }

    @Override
    public boolean isRouteComplete(NHttpClientConnection nHttpClientConnection) {
        return false;
    }

    @Override
    public void execute(IOEventDispatch ioEventDispatch) throws IOException {

    }
    // Sınıfın içeriği
}