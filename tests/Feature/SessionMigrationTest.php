<?php

use Illuminate\Support\Facades\Schema;

test('sessions table exists after migrations', function () {
    expect(Schema::hasTable('sessions'))->toBeTrue();
});
