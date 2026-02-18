<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Gate;
use Dedoc\Scramble\Scramble;
use Dedoc\Scramble\Support\Generator\OpenApi;
use Dedoc\Scramble\Support\Generator\SecurityScheme;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (app()->environment('production')) {
        URL::forceScheme('https');
    }

        Gate::define('viewApiDocs', function ($user = null) {
            if (app()->environment('local')) {
                return true;
            }

           return $user?->role === 'administrator';
        });

         Scramble::afterOpenApiGenerated(function (OpenApi $openApi) {
        $openApi->secure(
            SecurityScheme::http('bearer')
        );
    });


    
   
    }

    
    
}
